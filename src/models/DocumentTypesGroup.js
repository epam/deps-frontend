
import PropTypes from 'prop-types'

class GenAiClassifier {
  constructor ({
    genAiClassifierId,
    documentTypeId,
    llmType,
    name,
    prompt,
  }) {
    this.genAiClassifierId = genAiClassifierId
    this.documentTypeId = documentTypeId
    this.llmType = llmType
    this.name = name
    this.prompt = prompt
  }
}

const genAiClassifierShape = PropTypes.shape({
  genAiClassifierId: PropTypes.string.isRequired,
  documentTypeId: PropTypes.string.isRequired,
  llmType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  prompt: PropTypes.string.isRequired,
})

class DocumentTypesGroup {
  constructor ({
    id,
    name,
    documentTypeIds,
    createdAt,
    genAiClassifiers = [],
  }) {
    this.id = id
    this.name = name
    this.documentTypeIds = documentTypeIds
    this.createdAt = createdAt
    this.genAiClassifiers = genAiClassifiers
  }
}

const documentTypesGroupShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  documentTypeIds: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  createdAt: PropTypes.string,
  genAiClassifiers: PropTypes.arrayOf(
    genAiClassifierShape,
  ),
})

export {
  DocumentTypesGroup,
  GenAiClassifier,
  documentTypesGroupShape,
  genAiClassifierShape,
}
