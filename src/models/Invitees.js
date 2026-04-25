
import PropTypes from 'prop-types'

const inviteesShape = PropTypes.arrayOf(
  PropTypes.shape({
    email: PropTypes.string.isRequired,
  }),
)

const inviteesMetaShape = PropTypes.shape({
  total: PropTypes.number,
  size: PropTypes.number,
})

export {
  inviteesShape,
  inviteesMetaShape,
}
