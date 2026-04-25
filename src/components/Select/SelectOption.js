
import PropTypes from 'prop-types'

class SelectOption {
  constructor (
    value,
    text,
    tooltip,
    disabled,
    renderOption,
    renderLabel,
  ) {
    this.value = value
    this.text = text
    tooltip && (this.tooltip = tooltip)
    disabled && (this.disabled = disabled)
    renderOption && (this.renderOption = renderOption)
    renderLabel && (this.renderLabel = renderLabel)
  }
}

const optionShape = PropTypes.shape({
  text: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  tooltip: PropTypes.shape({
    title: PropTypes.string,
    placement: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  renderOption: PropTypes.func,
  renderLabel: PropTypes.func,
})

const enumToOptions = (obj, mapper) => Object.keys(obj).map((key) => {
  const value = obj[key]
  return new SelectOption(value, (mapper && mapper[value]) || value)
})

const keyValueToOptions = (obj) => Object.keys(obj).map((key) => (
  new SelectOption(key, obj[key])
))

const stringsToOptions = (list, mapper) => list.map((value) => (
  new SelectOption(value, (mapper && mapper[value]) || value)
))

const getEmptyOption = (text) => new SelectOption(null, text)

const noneOption = new SelectOption('None', 'none')

const anyOption = new SelectOption('Any', 'any')

export {
  SelectOption,
  noneOption,
  anyOption,
  optionShape,
  enumToOptions,
  keyValueToOptions,
  stringsToOptions,
  getEmptyOption,
}
