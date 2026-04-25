
import PropTypes from 'prop-types'

class Comment {
  constructor (
    comment,
    createdBy,
    createdAt,
  ) {
    this.text = comment
    this.createdAt = createdAt
    this.createdBy = createdBy
  }
}

const commentShape = PropTypes.shape({
  createdAt: PropTypes.string.isRequired,
  createdBy: PropTypes.string,
  text: PropTypes.string.isRequired,
})

export {
  Comment,
  commentShape,
}
