
import PropTypes from 'prop-types'
import {
  InputNumber,
  Slider,
  Wrapper,
} from './GraduatedSlider.styles'

const GraduatedSlider = ({
  disabled,
  min,
  max,
  onChange,
  precision,
  step,
  value,
}) => (
  <Wrapper>
    <Slider
      disabled={disabled}
      dots={true}
      max={max}
      min={min}
      onChange={onChange}
      step={step}
      value={value}
    />
    <InputNumber
      controls={false}
      disabled={disabled}
      max={max}
      min={min}
      onChange={onChange}
      precision={precision}
      stringMode
      value={value}
    />
  </Wrapper>
)

GraduatedSlider.propTypes = {
  disabled: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  precision: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export {
  GraduatedSlider,
}
