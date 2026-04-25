
import PropTypes from 'prop-types'

export class MentionOption {
  constructor ({
    id,
    display,
  }) {
    this.id = id
    this.display = display
  }
}

export const mentionOptionShape = PropTypes.shape({
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  display: PropTypes.string.isRequired,
})
