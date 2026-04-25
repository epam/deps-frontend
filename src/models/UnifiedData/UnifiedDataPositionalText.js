
import PropTypes from 'prop-types'
import { unifiedDataWordShape } from './UnifiedDataWord'

class UnifiedDataPositionalText {
  constructor (id, page, wordboxes) {
    this.id = id
    this.page = page
    this.wordboxes = wordboxes
  }
}

const unifiedDataPositionalTextShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  wordboxes: PropTypes.arrayOf(unifiedDataWordShape),
})

export {
  UnifiedDataPositionalText,
  unifiedDataPositionalTextShape,
}
