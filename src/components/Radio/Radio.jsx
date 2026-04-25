
import AntdRadio from 'antd/es/radio'
import 'antd/lib/radio/style/index.less'
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { Tooltip } from '@/components/Tooltip'
import { StyledRadioGroup } from './Radio.styles'
import { radioOptionShape } from './RadioOption'

const RadioOptionType = {
  BUTTON: 'button',
  DEFAULT: 'default',
}

const RadioButtonStyle = {
  SOLID: 'solid',
  OUTLINE: 'outline',
}

class RadioGroup extends PureComponent {
  onChange = (e) => {
    this.props.onChange?.(e.target.value)
  }

  getRadioOption = (option, idx, optionType) => (
    <Radio
      key={idx}
      optionType={optionType}
      value={option.value}
    >
      {option.icon}
      {option.text}
    </Radio>
  )

  render = () => {
    const {
      options,
      optionType,
      ...rest
    } = this.props

    return (
      <StyledRadioGroup
        {...rest}
        onChange={this.onChange}
      >
        {
          this.props.options.map((option, idx) => {
            const hasTooltip = !!option.tooltip
            return hasTooltip
              ? (
                <Tooltip
                  {...option.tooltip}
                  key={idx}
                >
                  {this.getRadioOption(option, idx, optionType)}
                </Tooltip>
              )
              : this.getRadioOption(option, idx, optionType)
          })
        }
      </StyledRadioGroup>
    )
  }
}

RadioGroup.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(radioOptionShape).isRequired,
  optionType: PropTypes.oneOf(
    Object.values(RadioOptionType),
  ),
}

const Radio = ({
  optionType,
  ...rest
}) => {
  if (optionType === RadioOptionType.BUTTON) {
    return (
      <AntdRadio.Button {...rest} />
    )
  }

  return (
    <AntdRadio
      {...rest}
    />
  )
}

Radio.propTypes = {
  optionType: PropTypes.oneOf(
    Object.values(RadioOptionType),
  ),
}

const GroupOfRadio = (props) => (
  <AntdRadio.Group {...props} />
)

export {
  GroupOfRadio,
  Radio,
  RadioGroup,
  RadioOptionType,
  RadioButtonStyle,
}
