
import PropTypes from 'prop-types'
import { CrossFieldValidator } from '@/models/CrossFieldValidator'

const FieldValidationType = {
  ERRORS: 'errors',
  CROSS_FIELD_ERRORS: 'crossFieldErrors',
  WARNINGS: 'warnings',
  CROSS_FIELD_WARNINGS: 'crossFieldWarnings',
}

const KvId = {
  KEY: 'key',
  VALUE: 'value',
}

const FieldValidationSeverity = {
  ERROR: 'error',
  WARNING: 'warning',
}

const validationDescriptionShape = PropTypes.shape({
  column: PropTypes.number,
  message: PropTypes.string.isRequired,
  index: PropTypes.number,
  row: PropTypes.number,
  kvId: PropTypes.oneOf(Object.values(KvId)) || null,
  severity: PropTypes.oneOf(
    Object.values(FieldValidationSeverity),
  ),
})

const fieldValidationShape = PropTypes.shape({
  errors: PropTypes.arrayOf(validationDescriptionShape),
  warnings: PropTypes.arrayOf(validationDescriptionShape),
  crossFieldErrors: PropTypes.arrayOf(validationDescriptionShape),
  crossFieldWarnings: PropTypes.arrayOf(validationDescriptionShape),
})

const documentValidationShape = PropTypes.shape({
  isValid: PropTypes.bool,
  detail: PropTypes.arrayOf(
    PropTypes.shape({
      fieldCode: PropTypes.string,
      documentId: PropTypes.string,
      fieldValidationShape,
    }),
  ),
})

class FieldValidation {
  constructor (
    errors,
    warnings,
    crossFieldErrors,
    crossFieldWarnings,
  ) {
    this.errors = errors
    this.warnings = warnings
    this.crossFieldErrors = crossFieldErrors
    this.crossFieldWarnings = crossFieldWarnings
  }

  static getMessages (validation, row, col, index, key, fields) {
    if (!validation) {
      return null
    }

    if (!validation[key]?.length) {
      return null
    }

    const messages = validation[key]
      .filter((v) =>
        v.column === col &&
        v.row === row &&
        (v.index === null || v.index === index) &&
        v.kvId === null,
      )
      .map((v) =>
        fields ? CrossFieldValidator.replaceFieldCodesInMessage(v.message, fields) : v.message,
      )

    return messages.length > 0 ? messages : null
  }

  static getErrorMessages (validation, row, col, index, dtFields) {
    const errors = this.getMessages(validation, row, col, index, FieldValidationType.ERRORS)
    const crossFieldErrors = this.getMessages(validation, row, col, index, FieldValidationType.CROSS_FIELD_ERRORS, dtFields)
    const allErrors = this.getAllErrors({
      errors,
      crossFieldErrors,
    })
    return allErrors.length ? allErrors : null
  }

  static getWarningMessages (validation, row, col, index, dtFields) {
    const warnings = this.getMessages(validation, row, col, index, FieldValidationType.WARNINGS)
    const crossFieldWarnings = this.getMessages(validation, row, col, index, FieldValidationType.CROSS_FIELD_WARNINGS, dtFields)
    const allWarnings = this.getAllWarnings({
      warnings,
      crossFieldWarnings,
    })
    return allWarnings.length ? allWarnings : null
  }

  static getAllErrors (validation) {
    return [
      ...(validation?.errors ?? []),
      ...(validation?.crossFieldErrors ?? []),
    ]
  }

  static getAllWarnings (validation) {
    return [
      ...(validation?.warnings ?? []),
      ...(validation?.crossFieldWarnings ?? []),
    ]
  }

  static hasIssues (validation) {
    const allErrors = this.getAllErrors(validation)
    const allWarnings = this.getAllWarnings(validation)
    return !!allErrors.length || !!allWarnings.length
  }
}

class DocumentValidation {
  constructor (isValid, detail) {
    this.isValid = isValid
    this.detail = detail
  }

  static getFieldValidation (documentValidation, fieldCode) {
    if (!documentValidation?.detail?.length) {
      return null
    }

    const validation = documentValidation.detail.find((f) => f.fieldCode === fieldCode)
    if (!validation) {
      return null
    }

    return new FieldValidation(
      validation.errors,
      validation.warnings,
      validation.crossFieldErrors,
      validation.crossFieldWarnings,
    )
  }
}

export {
  DocumentValidation,
  FieldValidation,
  FieldValidationType,
  documentValidationShape,
  fieldValidationShape,
  validationDescriptionShape,
  KvId,
  FieldValidationSeverity,
}
