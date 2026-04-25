
import PropTypes from 'prop-types'
import { organisationShape } from './Organisation'

const DEFAULT_USER_NAME = 'User'

class User {
  constructor (
    email,
    firstName,
    lastName,
    organisation,
    username,
    pk,
    creationDate,
    url,
  ) {
    this.pk = pk
    this.creationDate = creationDate
    this.username = username
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.organisation = organisation
    this.defaultCustomizationUrl = url
  }

  static #getFullName = ({ firstName, lastName }) => `${firstName || ''} ${lastName || ''}`.trim()

  static getTitle = ({ firstName, lastName, email }) => {
    if (!firstName && !lastName) {
      return email
    }
    return User.#getFullName({
      firstName,
      lastName,
    })
  }

  static getName = ({ firstName, lastName }) => {
    if (!firstName && !lastName) {
      return DEFAULT_USER_NAME
    }

    return User.#getFullName({
      firstName,
      lastName,
    })
  }
}

const userShape = PropTypes.shape({
  pk: PropTypes.string.isRequired,
  creationDate: PropTypes.string,
  username: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string.isRequired,
  organisation: organisationShape,
  defaultCustomizationUrl: PropTypes.string,
})

const usersMetaShape = PropTypes.shape({
  total: PropTypes.number,
  size: PropTypes.number,
})

export {
  User,
  userShape,
  usersMetaShape,
}
