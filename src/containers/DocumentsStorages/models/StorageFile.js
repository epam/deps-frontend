
import PropTypes from 'prop-types'

class StorageFile {
  constructor ({
    id,
    mimeType,
    name,
    sizeBytes,
  }) {
    this.id = id
    this.mimeType = mimeType
    this.name = name
    this.sizeBytes = sizeBytes
  }
}

const storageFileShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  sizeBytes: PropTypes.number.isRequired,
})

export {
  StorageFile,
  storageFileShape,
}
