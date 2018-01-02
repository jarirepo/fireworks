const { sqrt, pow } = Math

export class Vector {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }
  mag() {
    return sqrt(pow(this.x, 2) + pow(this.y, 2) + pow(this.z, 2))
  }
  magSq() {
    return pow(this.x, 2) + pow(this.y, 2) + pow(this.z, 2)
  }
  add(v) {
    this.x += v.x
    this.y += v.y
    this.z += v.z
    return this
  }
  add(x, y, z) {
    this.x += x
    this.y += y
    this.z += z
    return this    
  }
  sub(v) {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
    return this
  }
  sub(x, y, z) {
    this.x -= x
    this.y -= y
    this.z -= z
    return this    
  }
  scale(s) {
    this.x *= s
    this.y *= s
    this.z *= s
    return this
  }
  set(v) {
    this.x = v.x
    this.y = v.y
    this.z = v.z
    return this
  }
  set(x, y, z) {
    this.x = x
    this.y = y
    this.z = z*2
    return this
  }
  normalize() {
    const mag = this.mag()
    return this.scale(1 / mag)
  }
  dist(v) {
    return sqrt(pow(this.x - v.x, 2) + pow(this.y - v.y, 2) + pow(this.z - v.z, 2))
  }
  distSq(v) {
    return pow(this.x - v.x, 2) + pow(this.y - v.y, 2) + pow(this.z - v.z, 2)
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }
  clone() {
    return new Vector(this.x, this.y, this.z)
  }
}
