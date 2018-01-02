import { newVector } from './real3d/real3d'
import { Rocket } from './rocket'

const { cos, PI, random, sin } = Math

function *rng() {
  while (true) {
    yield random()
  }
}

export class Simulation {
  constructor(options = {}) {
    this.options = options
    this.rockets = new Array()
    this.totalTime = 0
    this.lastTime = 0
    this._timer = null
    this._launchRockets(options.launchPeriod)
  }
  
  update(t) {
    for (let r of this.rockets) {
      r.fire()
      r.explode(this.options.timestep)
      r.applyForce(0, r.mass * this.options.gravity, 0)
      r.update(this.options.timestep)
    }
  }

  render(ctx) {
    this.rockets.forEach(r => r.show(ctx))
  }

  _launchRockets(period) {
    this._timer = setInterval(() => {
      // remove exploded rockets
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const r = this.rockets[i]
        if (r.exploded && r.children.length === 0) {
          this.rockets.splice(i, 1)
        } 
      }
        
      // create new rocket
      let n = this.rockets.length
      if (n < this.options.maxRockets) {
        let r = new Rocket(this.options.canvas.width / 2, this.options.canvas.height - 1, 0)
        let theta = -PI / 2 - PI / 12 + PI / 6 * random()
        let vx = -0.1 + 0.2 * random()
        let v = newVector(vx, -1, 0)
        v.normalize()
        this.rockets.push(r)
        r.launch(v)
      }
    }, period)
  }
}
