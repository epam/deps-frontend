
import PropTypes from 'prop-types'
import { ValidationRuleSeverity } from '@/enums/ValidationRuleSeverity'
import { ValidatorsFieldType } from '@/enums/ValidatorsFieldType'

class ValidatorRule {
  constructor ({
    name,
    severity,
    rule,
    issueMessage,
    needWarningEvenIfOptional,
    forEach,
    forAny,
    checkOptionalFields,
  }) {
    this.name = name
    this.severity = severity
    this.rule = rule
    this.issueMessage = issueMessage
    this.needWarningEvenIfOptional = needWarningEvenIfOptional
    this.forEach = forEach
    this.forAny = forAny
    this.checkOptionalFields = checkOptionalFields
  }
}

const validatorRuleShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(
    Object.values(ValidationRuleSeverity),
  ).isRequired,
  rule: PropTypes.string.isRequired,
  issueMessage: PropTypes.string,
  needWarningEvenIfOptional: PropTypes.bool.isRequired,
  forEach: PropTypes.bool.isRequired,
  forAny: PropTypes.bool.isRequired,
  checkOptionalFields: PropTypes.bool.isRequired,
})

class ValidatorType {
  constructor ({
    description,
    type,
  }) {
    this.description = description
    this.type = type
  }
}

const validatorTypeShape = PropTypes.shape({
  description: PropTypes.shape({
    itemType: PropTypes.oneOf(
      Object.values(ValidatorsFieldType),
    ),
    maxLength: PropTypes.number,
  }).isRequired,
  type: PropTypes.oneOf(
    Object.values(ValidatorsFieldType),
  ).isRequired,
})

class Validator {
  constructor ({
    code,
    isRequired,
    rules,
    type,
  }) {
    this.code = code
    this.isRequired = isRequired
    this.rules = rules
    this.type = type
  }
}

const validatorShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  rules: PropTypes.arrayOf(
    validatorRuleShape,
  ),
  type: validatorTypeShape.isRequired,
})

export {
  Validator,
  validatorShape,
  ValidatorType,
  validatorTypeShape,
  ValidatorRule,
  validatorRuleShape,
}
