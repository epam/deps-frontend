
import PropTypes from 'prop-types'
import { RadioButtonStyle, RadioOptionType } from '@/components/Radio'
import { radioOptionShape } from '@/components/Radio/RadioOption'
import { StyledRadioGroup } from './DualToggle.styles'

const DualToggle = ({
  className,
  disabled,
  options,
  onChange,
  value,
}) => (
  <StyledRadioGroup
    buttonStyle={RadioButtonStyle.SOLID}
    className={className}
    disabled={disabled}
    onChange={onChange}
    optionType={RadioOptionType.BUTTON}
    options={options}
    value={value}
  />
)

DualToggle.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(radioOptionShape).isRequired,
}

export {
  DualToggle,
}
