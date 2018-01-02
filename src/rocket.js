import { newVector, Real3D } from './real3d/real3d'
import { Particle } from './particle'

const { abs, cos, PI, pow, random, sin, sqrt } = Math
const { now } = Date
const TWO_PI = 2 * PI

let rocketCtr = 0


export class Rocket extends Particle {

  constructor(x, y, z = 0) {
    super(x, y, z)
    this.number = ++rocketCtr
    this.mass = 1
    this.firing = false
    this.firingTime = 1
    this.launchTime = NaN
    this.launchDir = newVector()
    this.maxForce = 300 + 200 * random()
    this.exploded = false
    this.explosionTime = NaN
    // this.hue = 127 + 128 * random() | 0
    this.hue = (64 + 2 * rocketCtr) % 256
  }

  launch(dir) {
    this.launchDir.set(dir.x, dir.y, dir.z)
    this.launchTime = now()
    this.firing = true
    // console.log(`Rocket ${this.number} was launched`)
  }

  fire() {
    if (!this.firing) { return }
    const t = (now() - this.launchTime) / 1000
    if (t < this.firingTime) {
      let c = t / this.firingTime
      let Fmag = this.maxForce * (1 + sin(2 * PI * c - PI / 2)) / 2
      let f
      if (this.flightTime > 0) {
        f = this.vel.clone().normalize().scale(Fmag)
      }else {
        f = this.launchDir.clone().normalize().scale(Fmag)
        this.vel.set(this.launchDir.x, this.launchDir.y, this.launchDir.z)    
      }
      this.applyForce(f.x, f.y, f.z)
    }else {
      this.firing = false
      // console.log(`Rocket ${this.number} stopped firing`)
    }
    this.flightTime = t
  }

  explode(dt) {
    if (this.firing) { return }
    if (this.vel.y <= 0) { return }

    if (!this.exploded) {
      // create particles
      const n = 50 + 100 * random() | 0
      const w = 1 + 9 * random()
      for (let i = 0; i < n; i++) {
        let x = this.pos.x - w / 2  + w * random()
        let y = this.pos.y - w / 2  + w * random()
        let z = this.pos.z - w / 2  + w * random()
        let p = new Particle(x, y, z)
        p.mass = 0.5 + random() / 2
        if (random() < 0.5) {
          p.mass *= -1
        }
        p.vel.set(this.vel.x, this.vel.y, this.vel.z)
        this.addChild(p)
      }
      this.explosionTime = now()
      this.exploded = true
      // console.log(`Rocket ${this.number} exploded`)

    } else {
      // update particles
      const G = 2000 * (1 + random())
      let v = newVector(0, 0, 0)
      let v2 = newVector(0, 0, 0)
      let r2
      let mag
      
      let P = this.children
      
      for (let i = 0; i < P.length - 1; i++) {
        for (let j = i + 1; j < P.length; j++) {
          v.set(
            P[j].pos.x - P[i].pos.x,
            P[j].pos.y - P[i].pos.y,
            P[j].pos.z - P[i].pos.z
          )
          r2 = 1 + v.magSq()
          v2.set(v.x, v.y, v.z).normalize()
          mag = G * P[i].mass * P[j].mass / r2
          P[i].applyForce(mag * v2.x, mag * v2.y, mag * v2.z)
          P[j].applyForce(-mag * v2.x, -mag * v2.y, -mag * v2.z)            
        }
      }

      const gravity = 40

      P.forEach(p => {
        p.applyForce(0, abs(p.mass) * gravity, 0)
        p.update(dt)
      })
    }
  }

  show(ctx) {
    let v = this.vel.clone().normalize()

    if (!this.exploded) {
      const t = (now() - this.launchTime) / 1000
      let alpha = (1 - 1 / (1 + 0.01 * t * t)) / 2
      ctx.beginPath()
      // ctx.strokeStyle = 'rgba(102, 204, 51, 0.75)'
      ctx.strokeStyle = `hsla(${this.hue},100%,50%,${alpha})`
      ctx.lineWidth = 4
      ctx.moveTo(this.pos.x - 10 * v.x, this.pos.y - 10 * v.y)
      ctx.lineTo(this.pos.x + 10 * v.x, this.pos.y + 10 * v.y)
      ctx.stroke()
    }

    //ctx.beginPath()
    //ctx.moveTo(this.pos.x, this.pos.y)
    //ctx.lineTo(this.pos.x + 20 * v.x, this.pos.y + 20 * v.y)
    //ctx.stroke()

    if (this.exploded) {
      // elapsed time since explosion
      let t = (now() - this.explosionTime) / 1000
      // alpha -> 0 with increasing distance      
      let alpha = 1 / (1 + t * t)
      
      for (let p of this.children) {
        // distance from parent (rocket)
        let d2 = this.pos.dist(p.pos)
        // radius -> 50 with increasing distance from the parent
        p.radius = 1 + 50 * (1 - 1 / (1 + 0.001 * d2))
        
        if (p.pos.x - p.radius > 0 && p.pos.x + p.radius < ctx.canvas.width && 
            p.pos.y - p.radius > 0 && p.pos.y + p.radius < ctx.canvas.height) {
          ctx.beginPath()
          ctx.fillStyle = `hsla(${this.hue},100%,50%,${alpha})`
          ctx.arc(p.pos.x, p.pos.y, p.radius, 0, TWO_PI)
          ctx.fill()  
        }
      }  

      if (alpha < 0.01) {
        // remove dead particles
        for (let i = this.children.length - 1; i >= 0; i--) {
          this.children.splice(i, 1)
        }
      }
    }
  } 
}
