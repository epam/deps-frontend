
import PropTypes from 'prop-types'
import { ValidationRuleSeverity } from '@/enums/ValidationRuleSeverity'

class IssueMessage {
  constructor ({
    dependentFields = [],
    message,
  }) {
    this.dependentFields = dependentFields
    this.message = message
  }

  static createMessageField = (fieldCode) => '${' + fieldCode + '}'
}

const issueMessageShape = PropTypes.shape({
  dependentFields: PropTypes.arrayOf(PropTypes.string),
  message: PropTypes.string.isRequired,
})

class CrossFieldValidator {
  constructor ({
    id,
    name,
    description,
    forEach,
    forAny,
    issueMessage,
    rule,
    severity,
    validatedFields,
  }) {
    this.id = id
    this.name = name
    this.description = description
    this.forEach = forEach
    this.forAny = forAny
    this.issueMessage = issueMessage
    this.rule = rule
    this.severity = severity
    this.validatedFields = validatedFields
  }

  static replaceFieldCodesInMessage (message, fields) {
    const regex = /\$\{(.*?)\}/g

    return (message || '').replace(regex, (_, code) => {
      const field = fields?.find((f) => f.code === code)
      return field ? field.name : code
    })
  }

  static createRuleField = (fieldCode) => `[F${fieldCode}]`
}

const crossFieldValidatorShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  forEach: PropTypes.bool.isRequired,
  forAny: PropTypes.bool.isRequired,
  issueMessage: issueMessageShape.isRequired,
  rule: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(
    Object.values(ValidationRuleSeverity),
  ).isRequired,
  validatedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
})

export {
  CrossFieldValidator,
  IssueMessage,
  crossFieldValidatorShape,
  issueMessageShape,
}
