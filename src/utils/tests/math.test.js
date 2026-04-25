
import { convertBytesToMegaBytes } from '@/utils/math'

describe('Utils: math.js', () => {
  it('should return file size in MB', () => {
    expect(convertBytesToMegaBytes(1_048_576)).toEqual(1)
  })
})
