
import { chunkArray } from '@/utils/array'

describe('chunkArray', () => {
  it('should split array into chunks of specified size', () => {
    const array = [1, 2, 3, 4, 5, 6]
    const result = chunkArray(array, 2)
    expect(result).toEqual([[1, 2], [3, 4], [5, 6]])
  })

  it('should handle array length not evenly divisible by chunk size', () => {
    const array = [1, 2, 3, 4, 5]
    const result = chunkArray(array, 2)
    expect(result).toEqual([[1, 2], [3, 4], [5]])
  })

  it('should return single chunk when array length is less than chunk size', () => {
    const array = [1, 2, 3]
    const result = chunkArray(array, 10)
    expect(result).toEqual([[1, 2, 3]])
  })

  it('should return empty array when input is empty', () => {
    const result = chunkArray([], 3)
    expect(result).toEqual([])
  })
})
