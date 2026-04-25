
import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import { DatePicker } from '@/components/DatePicker'
import { RECOGNIZABLE_DATE_FORMATS } from '@/constants/day'
import {
  getUtcStartOfDay,
  getUtcEndOfDay,
  LOCALE_DATE_FORMAT,
  stringToDayjs,
} from '@/utils/dayjs'
import { Wrapper } from './TableDateRangeFilter.styles'

const RangePicker = DatePicker.RangePicker

const setFocus = (el) => {
  setTimeout(() => {
    el.focus()
  })
}

const TableDateRangeFilter = ({
  onChange,
  dateRange,
  confirm,
  autoFocus,
}) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setFocus(inputRef.current)
    }
  }, [autoFocus])

  const onDateChange = (values) => {
    const updatedDateRange = []

    if (values) {
      const [start, end] = values
      updatedDateRange.push(getUtcStartOfDay(start), getUtcEndOfDay(end))
    }

    onChange(updatedDateRange)
    confirm()
  }

  const mapStringRangeToDayJsRange = () => (
    dateRange?.map((dateString) => stringToDayjs(dateString)) || []
  )

  return (
    <Wrapper>
      <RangePicker
        ref={inputRef}
        format={[LOCALE_DATE_FORMAT, ...RECOGNIZABLE_DATE_FORMATS]}
        onChange={onDateChange}
        open={autoFocus}
        value={mapStringRangeToDayJsRange()}
      />
    </Wrapper>
  )
}

TableDateRangeFilter.propTypes = {
  confirm: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  dateRange: PropTypes.arrayOf(PropTypes.string),
  autoFocus: PropTypes.bool,
}

export {
  TableDateRangeFilter,
}
