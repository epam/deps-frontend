
import PropTypes from 'prop-types'
import { FileReferenceType } from '@/enums/FileReferenceType'

export class FileState {
  constructor ({
    status,
    errorMessage,
    errorCode,
  }) {
    this.status = status
    this.errorMessage = errorMessage
    this.errorCode = errorCode
  }
}

export class FileProcessingParams {
  constructor ({
    groupId,
    splittingEnabled,
    classificationEnabled,
    workflowParams,
  }) {
    this.groupId = groupId
    this.splittingEnabled = splittingEnabled
    this.classificationEnabled = classificationEnabled
    this.workflowParams = workflowParams
  }
}

export class FileWorkflowParams {
  constructor ({
    engine,
    language,
    llmType,
    parsingFeatures,
    needsUnifier,
    needsExtraction,
    assignedToMe,
    metadata,
  }) {
    this.engine = engine
    this.language = language
    this.llmType = llmType
    this.parsingFeatures = parsingFeatures
    this.needsUnifier = needsUnifier
    this.needsExtraction = needsExtraction
    this.assignedToMe = assignedToMe
    this.metadata = metadata
  }
}

export class FileReference {
  constructor ({
    entityId,
    entityName,
    entityType,
  }) {
    this.entityId = entityId
    this.entityName = entityName
    this.entityType = entityType
  }
}

export const fileReferenceShape = PropTypes.exact({
  entityId: PropTypes.string.isRequired,
  entityName: PropTypes.string.isRequired,
  entityType: PropTypes.oneOf(
    Object.values(
      FileReferenceType,
    ),
  ).isRequired,
})

export class File {
  constructor ({
    id,
    reference,
    tenantId,
    name,
    path,
    state,
    processingParams,
    createdAt,
    updatedAt,
    labels,
  }) {
    this.id = id
    this.reference = reference
    this.tenantId = tenantId
    this.name = name
    this.path = path
    this.state = state
    this.processingParams = processingParams
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.labels = labels
  }
}

export const fileStateShape = PropTypes.shape({
  status: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  errorCode: PropTypes.string,
})

export const fileProcessingParamsShape = PropTypes.shape({
  groupId: PropTypes.string,
  splittingEnabled: PropTypes.bool.isRequired,
  classificationEnabled: PropTypes.bool.isRequired,
  workflowParams: PropTypes.shape({
    documentTypeId: PropTypes.string,
  }),
})

export const fileWorkflowParamsShape = PropTypes.shape({
  documentTypeId: PropTypes.string,
  engine: PropTypes.string,
  language: PropTypes.string,
  llmType: PropTypes.string,
  parsingFeature: PropTypes.arrayOf(
    PropTypes.string,
  ),
  needsUnifier: PropTypes.bool.isRequired,
  needsExtraction: PropTypes.bool.isRequired,
  assignedToMe: PropTypes.bool.isRequired,
})

export const fileShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  reference: fileReferenceShape,
  tenantId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  state: fileStateShape,
  processingParams: fileProcessingParamsShape,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
})
