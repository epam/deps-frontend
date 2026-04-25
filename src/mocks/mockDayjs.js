
import { PROJECT_CREATION_DATE } from '@/constants/common'

const formats = {
  L: 'MM/DD/YYYY',
  LT: 'h:mm A',
  default: 'MM/DD/YYYY, HH:mm',
}

const mockDayjs = (dateTimeStr = PROJECT_CREATION_DATE) => ({
  __esModule: true,
  default: (() => {
    function dayjs (date = dateTimeStr) {
      return {
        valueOf: () => new Date(date).getTime(),
        format: () => date,
        isValid: () => true,
        diff: () => -100500,
        add: () => dayjs(date),
        startOf: () => dayjs(date),
        endOf: () => dayjs(date),
        subtract: () => dayjs(date),
        longDateFormat: (format = 'default') => formats[format],
        localeData: () => dayjs(date),
        toISOString: () => date,
      }
    }
    dayjs.locale = () => {}
    dayjs.extend = () => {}
    dayjs.utc = () => dayjs(dateTimeStr)
    return dayjs
  })(),
})

export {
  mockDayjs,
}
