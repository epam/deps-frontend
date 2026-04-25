
import { Rect } from '@/models/Rect'
import { transposeRect } from './math'

describe('utils: math: transposeRect', () => {
  let rect
  beforeEach(() => {
    rect = new Rect(10, 10, 10, 10)
  })

  it('should return correct rect in case of 0 rotate', () => {
    expect(transposeRect(0, rect)).toEqual(rect)
  })

  it('should return correct rect in case of 90/-270 rotate', () => {
    const newRect = new Rect(10, -19, 10, 10)
    expect(transposeRect(90, rect)).toEqual(newRect)
    expect(transposeRect(-270, rect)).toEqual(newRect)
  })

  it('should return correct rect in case of 180/-180 rotate', () => {
    const newRect = new Rect(-19, -19, 10, 10)
    expect(transposeRect(180, rect)).toEqual(newRect)
    expect(transposeRect(-180, rect)).toEqual(newRect)
  })

  it('should return correct rect in case of 270/-90 rotate', () => {
    const newRect = new Rect(-19, 10, 10, 10)
    expect(transposeRect(270, rect)).toEqual(newRect)
    expect(transposeRect(-90, rect)).toEqual(newRect)
  })
})
