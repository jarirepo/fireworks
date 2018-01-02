import { newVector, addVectors } from './real3d/real3d'

const TWO_PI = 2 * Math.PI

export class Particle {
  constructor(x, y, z = 0) {
    this.pos = newVector(x, y, z)
    this.vel = newVector()
    this.acc = newVector()
    this.force = newVector()
    this.mass = Math.random()
    this.parent = null
    this.children = []
    this.radius = 1
  }

  addChild(particle) {
    particle.parent = this
    this.children.push(particle)
  }

  applyForce(f) {
    this.force.add(f)
    return this
  }

  applyForce(fx, fy, fz) {
    this.force.add(fx, fy, fz)
    return this
  }

  update(dt) {
    this.acc.set(
      this.force.x / this.mass,
      this.force.y / this.mass,
      this.force.z / this.mass
    )
    this.pos.add(
      this.vel.x * dt + this.acc.x * dt * dt / 2,
      this.vel.y * dt + this.acc.y * dt * dt / 2,
      this.vel.z * dt + this.acc.z * dt * dt / 2
    )
    this.vel.add(
      this.acc.x * dt,
      this.acc.y * dt,
      this.acc.z * dt
    )
    this.force.set(0, 0, 0)
  }
  
  show(ctx) {
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, TWO_PI)
    ctx.fill()
  }
}
