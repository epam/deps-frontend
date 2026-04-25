
import PropTypes from 'prop-types'
import { rectCoordsShape } from './Rect'

class TemplateVersion {
  constructor ({
    id,
    name,
    createdAt,
    templateId,
    originalFiles = [],
    referencePages = [],
  }) {
    this.id = id
    this.name = name
    this.createdAt = createdAt
    this.originalFiles = originalFiles
    this.referencePages = referencePages
    this.templateId = templateId
  }
}

const templateVersionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  templateID: PropTypes.string.isRequired,
  originalFiles: PropTypes.arrayOf(PropTypes.string),
  referencePages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      blobName: PropTypes.string.isRequired,
      markups: PropTypes.arrayOf(
        PropTypes.shape({
          code: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
          coordinates: PropTypes.arrayOf(rectCoordsShape),
        }).isRequired,
      ),
    }),
  ),
})

export {
  TemplateVersion,
  templateVersionShape,
}
