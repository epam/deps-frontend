
import PropTypes from 'prop-types'

class Label {
  constructor (id, name) {
    this._id = id
    this.name = name
  }

  static toOption = (label) => ({
    value: label._id,
    text: label.name,
  })
}

const labelShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
})

export {
  Label,
  labelShape,
}
