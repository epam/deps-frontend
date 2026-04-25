import PropTypes from 'prop-types'

class DocumentReviewer {
  constructor ({
    id,
    email,
    firstName,
    lastName,
  }) {
    this.id = id
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
  }
}

const documentReviewerShape = PropTypes.shape({
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
})

export {
  DocumentReviewer,
  documentReviewerShape,
}
