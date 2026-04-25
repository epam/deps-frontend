
import PropTypes from 'prop-types'

class CanvasScaleConfig {
  constructor ({
    min,
    max,
    step,
    onChange,
    value,
  }) {
    this.min = min
    this.max = max
    this.step = step
    this.onChange = onChange
    this.value = value
  }
}

const canvasScaleConfigShape = PropTypes.shape({
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
})

export {
  CanvasScaleConfig,
  canvasScaleConfigShape,
}
