
import { Point } from '@/models/Point'
import { Rect } from '@/models/Rect'
import { mapRectsToPolygons } from './mapRectsToPolygons'

describe('mapper: mapRectsToPolygons', () => {
  let input, expected
  it('should map Rect coords to polygons correctly', () => {
    input = [new Rect(10, 10, 3, 5)]

    expected = [
      [
        new Point(10, 10),
        new Point(13, 10),
        new Point(13, 15),
        new Point(10, 15),
      ],
    ]

    expect(mapRectsToPolygons(input)).toEqual(expected)
  })
})
