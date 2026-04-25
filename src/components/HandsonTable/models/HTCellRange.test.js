
import { HTCellRange } from './HTCellRange'

describe('model: HTCellRange', () => {
  it('should return range without duplications when calling the removeDuplications method', () => {
    const expected = [[1, 1], [2, 2], [5, 4]]
    const range = [...expected, ...expected]

    expect(HTCellRange.removeDuplications(range)).toEqual(expected)
  })

  describe('method: getTopLeftCoordinates', () => {
    it('should return the correct value with different rows', () => {
      const range = [[7, 4, 5, 2], [6, 3, 8, 2]]
      const expected = [5, 2]

      expect(HTCellRange.getTopLeftCoordinates(range)).toEqual(expected)
    })

    it('should return the correct value with the same minRows', () => {
      const range = [[7, 4, 5, 2], [5, 3, 8, 1]]
      const expected = [5, 1]

      expect(HTCellRange.getTopLeftCoordinates(range)).toEqual(expected)
    })

    it('should return the correct value with undefined row2 and col2', () => {
      const range = [[7, 4]]
      const expected = [7, 4]

      expect(HTCellRange.getTopLeftCoordinates(range)).toEqual(expected)
    })
  })
})
