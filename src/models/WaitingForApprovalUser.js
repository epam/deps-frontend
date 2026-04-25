
import PropTypes from 'prop-types'

class WaitingForApprovalUser {
  constructor ({
    creationDate,
    email,
    firstName,
    lastName,
    organisation,
    pk,
    username,
  }) {
    this.creationDate = creationDate
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.organisation = organisation
    this.pk = pk
    this.username = username
  }
}

const waitingForApprovalUserShape = PropTypes.shape({
  pk: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  creationDate: PropTypes.string,
  username: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  organisation: PropTypes.string,
})

export {
  waitingForApprovalUserShape,
  WaitingForApprovalUser,
}
