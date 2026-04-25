
import dayjs from 'dayjs'
import {
  datesSorting,
  toLocalizedDateString,
  getDatesDifference,
  Period,
} from '../dayjs'

const date = '2020-04-21T07:51:32.844606+00:00'
const expectedDate = dayjs(date).format('L')
const expectedTime = dayjs(date).format('LT')
const firstMockDate = '2022-02-14T14:00:00.000Z'
const secondMockDate = '2022-02-15T15:30:00.000Z'

describe('Utils: Day.js', () => {
  beforeAll(() => {
    jest.spyOn(dayjs, 'locale').mockImplementation()
  })

  it('should return empty string if date is not provided', () => {
    expect(toLocalizedDateString('')).toEqual('')
  })

  it('should return empty string if invalid string passed instead of date', () => {
    expect(toLocalizedDateString('some invalid string')).toEqual('')
  })

  it('should return date and time if withTime is true', () => {
    expect(toLocalizedDateString(date, true)).toEqual(`${expectedDate}, ${expectedTime}`)
  })

  it('should return date only if withTime is not set', () => {
    expect(toLocalizedDateString(date)).toEqual(expectedDate)
  })

  it('should return date only if withTime is false', () => {
    expect(toLocalizedDateString(date)).toEqual(expectedDate)
  })

  describe('datesSorting', () => {
    it('should return -1 when the first date is earlier than the second date', () => {
      expect(datesSorting(firstMockDate, secondMockDate)).toBe(-1)
    })

    it('should return 1 when the first date is later than the second date', () => {
      expect(datesSorting(secondMockDate, firstMockDate)).toBe(1)
    })

    it('should return 0 when the two dates are equal', () => {
      expect(datesSorting(firstMockDate, firstMockDate)).toBe(0)
    })
  })

  describe('getDatesDifference', () => {
    it('should return correct dates difference if first date higher than second', () => {
      expect(getDatesDifference(secondMockDate, firstMockDate, Period.DAY)).toBe(1)
    })

    it('should return 1 when the first date is later than the second date', () => {
      expect(datesSorting(firstMockDate, secondMockDate, Period.DAY)).toBe(-1)
    })

    it('should return 0 when the two dates are equal', () => {
      expect(datesSorting(secondMockDate, secondMockDate, Period.DAY)).toBe(0)
    })
  })
})
