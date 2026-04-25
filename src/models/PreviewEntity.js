
import PropTypes from 'prop-types'
import { localize, Localization } from '@/localization/i18n'

const UNKNOWN = localize(Localization.UNKNOWN)

class PreviewEntity {
  constructor (name = UNKNOWN, code = UNKNOWN) {
    this.name = name
    this.code = code
  }
}

const previewEntityShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
})

export {
  PreviewEntity,
  previewEntityShape,
}
