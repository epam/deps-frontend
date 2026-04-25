
import { mockEnv } from '@/mocks/mockEnv'
import { HighlightedField } from './HighlightedField'

jest.mock('@/utils/env', () => mockEnv)

describe('Model: HighlightedField', () => {
  let ranges

  it('should create 1 area in case of input cell ranges are follows one by one', () => {
    ranges = [[0, 0], [0, 1], [0, 2]]
    const expected = [[0, 0, 0, 2]]

    expect(HighlightedField.getReducedRanges(ranges)).toEqual(expected)
  })

  it('should create 1 area in case of input cell ranges are follows one by one and got duplication in coordinates', () => {
    ranges = [[0, 0], [0, 1], [0, 2], [0, 1]]
    const expected = [[0, 0, 0, 2]]

    expect(HighlightedField.getReducedRanges(ranges)).toEqual(expected)
  })

  it('should create 2 areas, in case of input ranges are not follows one by one', () => {
    ranges = [[0, 0], [0, 1], [0, 2], [0, 4], [0, 5]]
    const expected = [[0, 0, 0, 2], [0, 4, 0, 5]]

    expect(HighlightedField.getReducedRanges(ranges)).toEqual(expected)
  })

  it('should correctly handle with four-coordinated ranges', () => {
    ranges = [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2], [0, 0, 1, 1]]
    const expected = [[0, 0, 1, 1], [0, 0, 2, 0], [0, 1, 0, 2]]

    expect(HighlightedField.getReducedRanges(ranges)).toEqual(expected)
  })
})
