
import PropTypes from 'prop-types'
import { ExtractionType } from '@/enums/ExtractionType'
import { KnownLanguage } from '@/enums/KnownLanguage'
import { crossFieldValidatorShape } from '@/models/CrossFieldValidator'
import { documentTypeExtraFieldShape } from '@/models/DocumentTypeExtraField'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { genAiClassifierShape } from '@/models/DocumentTypesGroup'
import { llmExtractorShape } from '@/models/LLMExtractor'
import { outputProfileShape } from '@/models/OutputProfile'
import { validatorShape } from '@/models/Validator'
import { workflowConfigurationShape } from '@/models/WorkflowConfiguration'

class ExtendedDocumentType {
  constructor ({
    code,
    name,
    createdAt,
    description,
    engine,
    extractionType = ExtractionType.ML,
    language = KnownLanguage.ENGLISH,
    llmExtractors = [],
    llmType,
    fields = [],
    extraFields = [],
    profiles = [],
    validators = [],
    classifiers,
    crossFieldValidators = [],
    workflowConfiguration,
  }) {
    this.code = code
    this.name = name
    this.createdAt = createdAt
    this.description = description
    this.engine = engine
    this.extractionType = extractionType
    this.language = language
    this.llmExtractors = llmExtractors
    this.llmType = llmType
    this.fields = fields
    this.extraFields = extraFields
    this.profiles = profiles
    this.validators = validators
    this.classifiers = classifiers
    this.crossFieldValidators = crossFieldValidators
    this.workflowConfiguration = workflowConfiguration
  }
}

const classifiersShape = PropTypes.shape({
  genAiClassifiers: PropTypes.arrayOf(
    genAiClassifierShape,
  ),
})

const extendedDocumentTypeShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  description: PropTypes.string,
  extractionType: PropTypes.oneOf(Object.values(ExtractionType)),
  engine: PropTypes.string,
  extraFields: PropTypes.arrayOf(documentTypeExtraFieldShape),
  fields: PropTypes.arrayOf(documentTypeFieldShape),
  language: PropTypes.string,
  llmExtractors: PropTypes.arrayOf(llmExtractorShape),
  llmType: PropTypes.string,
  profiles: PropTypes.arrayOf(outputProfileShape),
  crossFieldValidators: PropTypes.arrayOf(crossFieldValidatorShape),
  validators: PropTypes.arrayOf(validatorShape),
  classifiers: PropTypes.arrayOf(classifiersShape),
  workflowConfiguration: workflowConfigurationShape,
})

export {
  ExtendedDocumentType,
  extendedDocumentTypeShape,
}
