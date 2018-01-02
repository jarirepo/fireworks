import { Vector } from './vector'

const {cos, sin} = Math

export const Real3D = {
  Vector: {
    add: (u, v) => u.clone().add(v),
    sub: (u, v) => u.clone().sub(v),
    dist: (u, v) => u.dist(v),
    distSq: (u,v) => u.distSq(v),
    fromAngle: (theta) => new Vector(cos(theta), sin(theta))
  }
}

export const newVector = (x = 0, y = 0, z = 0) => new Vector(x, y, z)
export const addVectors = (u, v) => u.clone().add(v)
export const subVectors = (u, v) => u.clone().sub(v)
export const dist = (u, v) => u.dist(v)
export const distSq = (u, v) => u.distSq(v)
