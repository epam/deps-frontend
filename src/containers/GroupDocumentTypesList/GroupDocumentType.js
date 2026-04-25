
import PropTypes from 'prop-types'
import { ExtractionType } from '@/enums/ExtractionType'
import { genAiClassifierShape } from '@/models/DocumentTypesGroup'

class GroupDocumentType {
  constructor ({
    id,
    groupId,
    name,
    extractionType = ExtractionType.ML,
    classifier,
  }) {
    this.id = id
    this.groupId = groupId
    this.name = name
    this.extractionType = extractionType
    this.classifier = classifier
  }
}

const groupDocumentTypeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  extractionType: PropTypes.oneOf(
    Object.values(ExtractionType),
  ).isRequired,
  classifier: genAiClassifierShape,
})

export {
  GroupDocumentType,
  groupDocumentTypeShape,
}
