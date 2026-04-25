
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MinusOutlinedIcon } from '@/components/Icons/MinusOutlinedIcon'
import { PlusIcon } from '@/components/Icons/PlusIcon'
import { IconWrapper, ScaleInputNumber, SliderComponent, StyledSlider as Slider, SliderButton } from './Slider.styles'

class CustomSlider extends Component {
  onChange = (value) => {
    if (!value || value < this.props.min || value > this.props.max) {
      return false
    }
    this.props.onChange(value)
  }

  incrementValue = () => {
    const { onChange, value, step } = this.props
    onChange(value + step)
  }

  decrementValue = () => {
    const { onChange, value, step } = this.props
    onChange(value - step)
  }

  formatter = (value) => {
    if (Number(value)) {
      return `${parseInt(value, 10)}${this.props.valuePrefix}`
    }
  }

  render () {
    const { min, max, value, step, disabled } = this.props
    return (
      <SliderComponent className={this.props.className}>
        <IconWrapper>
          <SliderButton
            disabled={value <= min || disabled}
            icon={<MinusOutlinedIcon />}
            onClick={this.decrementValue}
            shape="circle"
          />
          <Slider
            disabled={disabled}
            max={max}
            min={min}
            onChange={this.onChange}
            tooltip={
              {
                formatter: this.formatter,
              }
            }
            value={value}
          />
          <SliderButton
            disabled={value >= max || disabled}
            icon={<PlusIcon />}
            onClick={this.incrementValue}
            shape="circle"
          />
        </IconWrapper>
        <ScaleInputNumber
          disabled={disabled}
          formatter={this.formatter}
          max={max}
          min={min}
          onChange={this.onChange}
          step={step}
          value={value}
        />
      </SliderComponent>
    )
  }
}

CustomSlider.propTypes = {
  className: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valuePrefix: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

export {
  CustomSlider as Slider,
}
