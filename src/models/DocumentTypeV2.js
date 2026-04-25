
import PropTypes from 'prop-types'
import { ExtractionType } from '@/enums/ExtractionType'
import { crossFieldValidatorShape } from '@/models/CrossFieldValidator'
import { documentTypeExtraFieldShape } from '@/models/DocumentTypeExtraField'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { outputProfileShape } from '@/models/OutputProfile'
import { validatorShape } from '@/models/Validator'
import { workflowConfigurationShape } from '@/models/WorkflowConfiguration'

class DocumentTypeV2 {
  constructor ({
    id,
    createdAt,
    documentType,
    description,
    extractionType,
    engine,
    extraFields = [],
    extractionFields = [],
    language,
    llmExtractors = [],
    llmType,
    profiles = [],
    tenantId,
    validators = [],
    crossFieldValidators = [],
    workflowConfiguration,
  }) {
    this.id = id
    this.createdAt = createdAt
    this.documentType = documentType
    this.description = description
    this.extractionType = extractionType
    this.engine = engine
    this.extraFields = extraFields
    this.extractionFields = extractionFields
    this.language = language
    this.llmExtractors = llmExtractors
    this.llmType = llmType
    this.profiles = profiles
    this.tenantId = tenantId
    this.validators = validators
    this.crossFieldValidators = crossFieldValidators
    this.workflowConfiguration = workflowConfiguration
  }

  static toDocumentTypeV1 = (type) => ({
    ...type,
    code: type.id,
    name: type.documentType,
    fields: [],
  })

  static toExtendedDocumentType = (type) => ({
    ...type,
    code: type.id,
    name: type.documentType,
    fields: type.extractionFields || [],
    extraFields: type.extraFields || [],
    profiles: type.profiles || [],
    crossFieldValidators: type.crossFieldValidators || [],
    validators: type.validators || [],
    llmExtractors: type.llmExtractors || [],
  })
}

const documentTypeV2Shape = PropTypes.shape({
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  createdAt: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  description: PropTypes.string,
  extractionType: PropTypes.oneOf(Object.values(ExtractionType)),
  engine: PropTypes.string,
  extraFields: PropTypes.arrayOf(documentTypeExtraFieldShape),
  extractionFields: PropTypes.arrayOf(documentTypeFieldShape),
  language: PropTypes.string,
  llmType: PropTypes.string,
  profiles: PropTypes.arrayOf(outputProfileShape),
  crossFieldValidators: PropTypes.arrayOf(crossFieldValidatorShape),
  validators: PropTypes.arrayOf(validatorShape),
  tenantId: PropTypes.string,
  workflowConfiguration: workflowConfigurationShape,
})

export {
  DocumentTypeV2,
  documentTypeV2Shape,
}
