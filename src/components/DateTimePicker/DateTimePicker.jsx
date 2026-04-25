
import PropTypes from 'prop-types'
import { Component } from 'react'
import { stringToDayjs, LOCALE_DATE_TIME_FORMAT, TIME_FORMAT } from '@/utils/dayjs'
import { StyledDatePicker } from './DateTimePicker.styles'

class DateTimePicker extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    innerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
  }

  render () {
    const { disabled, value, onChange } = this.props
    return (
      <StyledDatePicker
        ref={this.props.innerRef}
        allowClear={false}
        disabled={disabled}
        format={LOCALE_DATE_TIME_FORMAT}
        getPopupContainer={(trigger) => trigger}
        onChange={onChange}
        placeholder={LOCALE_DATE_TIME_FORMAT}
        showTime={
          {
            format: TIME_FORMAT,
          }
        }
        showToday={false}
        value={stringToDayjs(value)}
      />
    )
  }
}

export {
  DateTimePicker,
}
