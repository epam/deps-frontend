
import PropTypes from 'prop-types'
import { ExtractionType } from '@/enums/ExtractionType'
import { FieldType } from '@/enums/FieldType'
import { KnownLanguage } from '@/enums/KnownLanguage'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { PreviewEntity } from './PreviewEntity'

class DocumentType {
  constructor (
    code,
    name,
    engine,
    language = KnownLanguage.ENGLISH,
    extractionType = ExtractionType.ML,
    fields = [],
    id,
  ) {
    this.code = code
    this.name = name
    this.engine = engine
    this.language = language
    this.extractionType = extractionType
    this.fields = fields
    this.id = id
  }

  static containsFieldWithPk = (documentTypeFields, fieldPk) => (
    documentTypeFields.some((field) => field.pk === fieldPk)
  )

  static toPreviewEntity = (documentType) => {
    return new PreviewEntity(documentType.name, documentType.code)
  }

  static toOption = (documentType) => ({
    value: documentType.code,
    text: documentType.name,
  })

  static getFieldsByFieldType = (documentType, fieldType) => {
    return documentType.fields.filter((f) => f.fieldType === fieldType)
  }

  static getFieldTypeByCode = (documentType, fieldCode) => {
    const { fieldType } = documentType.fields?.find((f) => f.code === fieldCode) || {}
    return fieldType
  }

  static getListFieldsByBaseType = (documentType, baseType) => {
    return documentType.fields.filter((f) => f.fieldType === FieldType.LIST && f.fieldMeta?.baseType === baseType)
  }

  static getPkByCode = (documentType, fieldCode) => {
    const { pk } = documentType.fields?.find((f) => f.code === fieldCode) || {}
    return pk
  }

  static toExtendedDocumentType = (type, extras = {}) => {
    return {
      ...type,
      extraFields: extras.extraFields || [],
      profiles: extras.profiles || [],
      validators: extras.validators?.validators || [],
      crossFieldValidators: extras.validators?.crossFieldValidators || [],
      classifiers: extras.classifiers || [],
      llmExtractors: extras.llmExtractors || [],
    }
  }
}

const documentTypeShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  engine: PropTypes.string,
  language: PropTypes.string,
  extractionType: PropTypes.oneOf(Object.values(ExtractionType)),
  fields: PropTypes.arrayOf(documentTypeFieldShape),
})

const UNKNOWN_DOCUMENT_TYPE = DocumentType.toExtendedDocumentType(
  new DocumentType('Unknown', 'Unknown', 'Unknown'),
)
const UNKNOWN_DOCUMENT_TYPE_PREVIEW_ENTITY = new PreviewEntity()

export {
  DocumentType,
  documentTypeShape,
  UNKNOWN_DOCUMENT_TYPE,
  UNKNOWN_DOCUMENT_TYPE_PREVIEW_ENTITY,
}
