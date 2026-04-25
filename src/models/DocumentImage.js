
import PropTypes from 'prop-types'

class DocumentImage {
  constructor (url, blobName) {
    this.url = url
    this.blobName = blobName
  }
}

const previewDocumentImageShape = PropTypes.oneOfType([
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    originalImageId: PropTypes.string,
    appliedTransformation: PropTypes.shape({
      name: PropTypes.string,
      parameters: PropTypes.shape(),
    }),
    blobName: PropTypes.string.isRequired,
  }),
  PropTypes.shape({
    url: PropTypes.string.isRequired,
    blobName: PropTypes.string.isRequired,
  }),
])

const processingImageShape = PropTypes.shape({
  url: PropTypes.string.isRequired,
  blobName: PropTypes.string.isRequired,
})

export {
  DocumentImage,
  previewDocumentImageShape,
  processingImageShape,
}
