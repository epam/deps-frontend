
import { mockEnv } from '@/mocks/mockEnv'
import { stringsSorter } from '@/utils/string'
import { defaultShowTotal } from '../tableUtils'

jest.mock('@/utils/env', () => mockEnv)

describe('Utils. TableUtils', () => {
  it('should return 0 if string are equal', () => {
    const a = 'string'
    const b = 'string'
    expect(stringsSorter(a, b)).toEqual(0)
  })

  it('should return -1 if first string less than second', () => {
    const a = 'a'
    const b = 'string'
    expect(stringsSorter(a, b)).toEqual(-1)
  })

  it('should return correct result if total and range are provided', () => {
    expect(defaultShowTotal(2, [0, 4])).toEqual('0-4 of 2 items')
  })
})
