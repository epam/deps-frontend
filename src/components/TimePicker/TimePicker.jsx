
import PropTypes from 'prop-types'
import { Component } from 'react'
import { stringToDayjs, dayjsToString, TIME_FORMAT } from '@/utils/dayjs'
import { StyledTimePicker } from './TimePicker.styles'

class TimePicker extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    innerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
  }

  static defaultProps = {
    value: '',
  }

  onChange = (date) => {
    const newValue = dayjsToString(date) === '' ? null : date.toISOString()
    this.props.onChange(newValue)
  }

  render () {
    const {
      disabled,
      value,
      placeholder,
    } = this.props

    return (
      <StyledTimePicker
        ref={this.props.innerRef}
        allowClear={false}
        disabled={disabled}
        format={TIME_FORMAT}
        getPopupContainer={(trigger) => trigger}
        onChange={this.onChange}
        placeholder={placeholder || TIME_FORMAT}
        value={stringToDayjs(value)}
      />
    )
  }
}

export {
  TimePicker,
}
