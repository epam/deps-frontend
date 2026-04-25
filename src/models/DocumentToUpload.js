
import PropTypes from 'prop-types'

class DocumentToUpload {
  constructor ({
    uid,
    name,
    documentType,
    engine,
    files,
  }) {
    this.uid = uid
    this.name = name
    this.documentType = documentType
    this.engine = engine
    this.files = files
  }
}

const documentToUploadShape = PropTypes.shape({
  uid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  documentType: PropTypes.string,
  engine: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape({
    uid: PropTypes.string,
    mime: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number,
  })).isRequired,
})

export {
  DocumentToUpload,
  documentToUploadShape,
}
