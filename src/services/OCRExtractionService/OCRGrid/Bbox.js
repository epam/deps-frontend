
import { valueIsInRange } from './OCRUtils'

export function inter (cMin1, cMax1, cMin2, cMax2) {
  return Math.max(0, Math.min(cMax1, cMax2) - Math.max(cMin1, cMin2))
}

function union (cMin1, cMax1, cMin2, cMax2) {
  return Math.max(cMax1, cMax2) - Math.min(cMin1, cMin2)
}

function cIou (cMin1, cMax1, cMin2, cMax2) {
  const yInter = inter(cMin1, cMax1, cMin2, cMax2)
  const yUnion = union(cMin1, cMax1, cMin2, cMax2)
  return yInter / yUnion
}

export class Bbox {
  constructor ({ y, x, h, w }) {
    this.y = this.#rectifyNearNegative(y, 'y')
    this.x = this.#rectifyNearNegative(x, 'x')
    this.h = h
    this.w = w

    this.#checkNearOneSum('y', 'h')
    this.#checkNearOneSum('x', 'w')

    this.#validateInitParams(this.x, this.y, this.h, this.w)
  }

  static fromUnion (bboxes) {
    const xMin = Math.min(...bboxes.map((bbox) => bbox.x))
    const xMax = Math.max(...bboxes.map((bbox) => bbox.xMax))
    const yMin = Math.min(...bboxes.map((bbox) => bbox.y))
    const yMax = Math.max(...bboxes.map((bbox) => bbox.yMax))
    return new Bbox({
      y: yMin,
      x: xMin,
      h: yMax - yMin,
      w: xMax - xMin,
    })
  }

  #rectifyNearNegative (value, name) {
    if (value < 0) {
      if (parseFloat(value.toFixed(2)) < 0) {
        throw new Error(`${name} coordinate is negative: ${value}`)
      }

      return 0
    }

    return value
  }

  #checkNearOneSum (first, second) {
    const el1 = this[first]
    const el2 = this[second]
    const elSum = el1 + el2

    if (elSum > 1.0) {
      if (parseFloat(elSum.toFixed(7)) !== 1.0) {
        if (parseFloat(elSum.toFixed(6)) === 1.0) {
          throw new Error('ValueError: 6')
        }
        throw new Error(`Sum of ${first} and ${second} is more than 1: ${el1} + ${el2}=${elSum}`)
      }
      this[second] = 1.0 - el1
    }
  }

  #validateInitParams (y, x, h, w) {
    if ([y, x, h, w].every((val) => valueIsInRange(val, 0, 1))) {
      throw Error('y, x, w, and h must be between 0 and 1')
    }
  }

  get yMax () {
    return this.y + this.h
  }

  get xMax () {
    return this.x + this.w
  }

  get yCenter () {
    return this.y + this.h / 2.0
  }

  get xCenter () {
    return this.x + this.w / 2.0
  }

  get square () {
    return this.h * this.w
  }

  toYXHW () {
    return [this.y, this.x, this.h, this.w]
  }

  toString () {
    return `(${this.y.toFixed(2)}, ${this.x.toFixed(2)}, ${this.h.toFixed(2)}, ${this.w.toFixed(2)})`
  }

  intersects (otherBbox) {
    return !(
      otherBbox.x > this.xMax ||
      otherBbox.xMax < this.x ||
      otherBbox.y > this.yMax ||
      otherBbox.yMax < this.y
    )
  }

  yIou (box2) {
    const [y1, , h1] = this.toYXHW()
    const [y2, , h2] = box2.toYXHW()
    return cIou(y1, y1 + h1, y2, y2 + h2)
  }

  iou (box) {
    const [y1, x1, h1, w1] = this.toYXHW()
    const [y2, x2, h2, w2] = box.toYXHW()
    const yIou = cIou(y1, y1 + h1, y2, y2 + h2)
    const xIou = cIou(x1, x1 + w1, x2, x2 + w2)
    return yIou * xIou
  }

  intersectionFraction (box) {
    const [y1, x1, h1, w1] = this.toYXHW()
    const [y2, x2, h2, w2] = box.toYXHW()
    const yInter = inter(y1, y1 + h1, y2, y2 + h2)
    const xInter = inter(x1, x1 + w1, x2, x2 + w2)
    return (yInter * xInter) / this.square
  }
}
