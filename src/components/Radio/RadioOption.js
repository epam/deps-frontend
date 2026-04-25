
import PropTypes from 'prop-types'

class RadioOption {
  constructor ({ value, text, tooltip, icon }) {
    this.value = value
    text && (this.text = text)
    tooltip && (this.tooltip = tooltip)
    icon && (this.icon = icon)
  }
}

const radioOptionShape = PropTypes.shape({
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  text: PropTypes.string,
  tooltip: PropTypes.shape({
    title: PropTypes.string,
    placement: PropTypes.string,
  }),
  icon: PropTypes.element,
})

export {
  RadioOption,
  radioOptionShape,
}
