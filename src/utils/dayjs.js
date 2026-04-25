
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import 'dayjs/locale/en-in'
import 'dayjs/locale/hi'

export const Period = {
  MILLISECOND: 'millisecond',
  SECOND: 'second',
  MINUTE: 'minute',
  HOUR: 'hour',
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
  DATE: 'date',
}

const locale = window.navigator.language || 'en'
dayjs.locale(locale)

export const LOCALE_DATE_FORMAT = dayjs().localeData().longDateFormat('L')
export const TIME_FORMAT = dayjs().localeData().longDateFormat('LT')
export const LOCALE_DATE_TIME_FORMAT = `${LOCALE_DATE_FORMAT} ${TIME_FORMAT}`

export const toLocalizedDateString = (str, withTime = false) => {
  const format = withTime ? 'L, LT' : 'L'
  const date = dayjs(str)
  return date.isValid() ? date.format(format) : ''
}

export const stringToDayjs = (str, format) => {
  if (!str) {
    return null
  }
  if (dayjs(str, format).isValid()) {
    return dayjs(str, format)
  }
  return null
}

export const dayjsToString = (dayjsObj, format) => {
  if (!dayjsObj) {
    return ''
  }
  if (dayjsObj.format(format) === 'Invalid Date') {
    return ''
  }
  return dayjsObj.format(format)
}

export const getStartOfDay = (dayjsObj) => dayjsObj.startOf(Period.DAY).toISOString()

export const getEndOfDay = (dayjsObj) => dayjsObj.endOf(Period.DAY).toISOString()

export const getUtcStartOfDay = (dayjsObj) => dayjsObj.utc().startOf(Period.DAY).toISOString()

export const getUtcEndOfDay = (dayjsObj) => dayjsObj.utc().endOf(Period.DAY).toISOString()

export const datesSorting = (a, b) => {
  const dateA = dayjs(a)
  const dateB = dayjs(b)

  if (dateA.isBefore(dateB)) {
    return -1
  } else if (dateA.isAfter(dateB)) {
    return 1
  }

  return 0
}

export const getDatesDifference = (d1, d2, period) => dayjs(d1).diff(d2, period)
