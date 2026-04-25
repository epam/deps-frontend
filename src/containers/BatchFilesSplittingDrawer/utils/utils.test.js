
import { areFilesEqual, getCurrentFilesCount } from './utils'

describe('utils: getCurrentFilesCount', () => {
  test('returns 0 if there are no splittable files', () => {
    expect(getCurrentFilesCount([], 0)).toBe(0)
  })

  test('returns 0 if there are no segments', () => {
    expect(getCurrentFilesCount([{ segments: [] }], 0)).toBe(0)
  })

  test('returns value if there are segments in one file', () => {
    expect(getCurrentFilesCount([{ segments: [1] }], 1)).toBe(1)
  })

  test('returns correct value if there are several files and segments', () => {
    expect(getCurrentFilesCount([{ segments: [1, 2] }], 2)).toBe(3)
  })
})

describe('utils: areFilesEqual', () => {
  test('returns true if files are equal', () => {
    expect(areFilesEqual([{ uid: '1' }], [{ uid: '1' }])).toBe(true)
  })

  test('returns false if files are not equal', () => {
    expect(areFilesEqual([{ uid: '1' }], [{ uid: '2' }])).toBe(false)
  })
})
