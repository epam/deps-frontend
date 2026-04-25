
import PropTypes from 'prop-types'

const emailShape = PropTypes.shape({
  body: PropTypes.string,
  recipients: PropTypes.arrayOf(PropTypes.string),
  cc: PropTypes.arrayOf(PropTypes.string),
  date: PropTypes.string,
  sender: PropTypes.string,
  subject: PropTypes.string,
  firstLevelChildCount: PropTypes.number,
  bcc: PropTypes.arrayOf(PropTypes.string),
})

export {
  emailShape,
}
