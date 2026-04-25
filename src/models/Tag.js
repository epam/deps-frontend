
import PropTypes from 'prop-types'

class Tag {
  constructor ({ id, text }) {
    this.id = id
    this.text = text
  }
}

const tagShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
})

export {
  Tag,
  tagShape,
}
