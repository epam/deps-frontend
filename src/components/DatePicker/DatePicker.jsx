
import PropTypes from 'prop-types'
import { Component } from 'react'
import { RECOGNIZABLE_DATE_FORMATS } from '@/constants/day'
import { dateJsShape } from '@/models/Date'
import { stringToDayjs, LOCALE_DATE_FORMAT } from '@/utils/dayjs'
import { StyledDatePicker } from './DatePicker.styles'

class DatePicker extends Component {
  static propTypes = {
    allowClear: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      dateJsShape,
    ]),
    disabled: PropTypes.bool,
    getPopupContainer: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    innerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
    suffixIcon: PropTypes.node,
  }

  static defaultProps = {
    allowClear: true,
  }

  onChange = (date) => {
    this.props.onChange(date)
  }

  onFocus = (event) => {
    this.props.onFocus?.(event)
  }

  getPopupContainer= (trigger) => trigger

  render = () => {
    return (
      <StyledDatePicker
        ref={this.props.innerRef}
        allowClear={this.props.allowClear}
        className={this.props.className}
        disabled={this.props.disabled}
        format={[LOCALE_DATE_FORMAT, ...RECOGNIZABLE_DATE_FORMATS]}
        getPopupContainer={this.props.getPopupContainer || this.getPopupContainer}
        onChange={this.onChange}
        onFocus={this.onFocus}
        placeholder={this.props.placeholder}
        suffixIcon={this.props.suffixIcon}
        value={stringToDayjs(this.props.value)}
      />
    )
  }
}

DatePicker.RangePicker = StyledDatePicker.RangePicker

export {
  DatePicker,
}
