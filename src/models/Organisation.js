
import PropTypes from 'prop-types'

const CUSTOMIZATION_ENTRY_POINT = '/exportPoint.js'

class Organisation {
  constructor (pk, name, url) {
    this.pk = pk
    this.name = name
    this.customizationUrl = url
  }

  static getCustomizationUrl = (url) => (
    url ? url + CUSTOMIZATION_ENTRY_POINT : null
  )
}

const organisationShape = PropTypes.shape({
  pk: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  customizationUrl: PropTypes.string,
})

export {
  Organisation,
  organisationShape,
}
