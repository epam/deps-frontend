
const VALIDATOR_MESSAGE_REGEXP = /\$\{(.*?)\}/g
const VALIDATOR_RULE_REGEXP = /\bF\w*/g

const replaceText = (text, fieldCodes, fieldsCodesMapping) => {
  let updatedText = text

  fieldCodes.forEach((code) => {
    const str = new RegExp(`${code}`, 'g')
    updatedText = updatedText.replace(str, fieldsCodesMapping[code])
  })

  return updatedText
}

const mapValidatorMessage = (text, fieldsCodesMapping) => {
  const matches = [...text.matchAll(VALIDATOR_MESSAGE_REGEXP)]

  if (matches.length === 0) {
    return text
  }

  const fieldCodes = matches.map(([, code]) => code)
  const uniqueFieldCodes = [...new Set(fieldCodes)]

  return replaceText(text, uniqueFieldCodes, fieldsCodesMapping)
}

const mapValidationRule = (text, fieldsCodesMapping) => {
  const matches = [...text.matchAll(VALIDATOR_RULE_REGEXP)]

  if (matches.length === 0) {
    return text
  }

  const fieldCodes = matches.map(([field]) => field.slice(1))
  const uniqueFieldCodes = [...new Set(fieldCodes)]

  return replaceText(text, uniqueFieldCodes, fieldsCodesMapping)
}

const mapValidatorToRequest = (validator, fields, fieldsCodesMapping) => {
  const {
    name,
    description,
    forAny,
    forEach,
    severity,
  } = validator

  const validatedFields = validator.validatedFields.map((fieldCode) => fieldsCodesMapping[fieldCode])
  const dependentFields = (validator.issueMessage?.dependentFields ?? validator.dependentFields ?? []).map(
    (fieldCode) => fieldsCodesMapping[fieldCode],
  )
  const issueMessage = mapValidatorMessage(validator.issueMessage.message, fieldsCodesMapping)
  const rule = mapValidationRule(validator.rule, fieldsCodesMapping)

  return {
    name,
    description,
    severity,
    rule,
    validatedFields,
    issueMessage,
    dependentFields,
    forEach,
    forAny,
  }
}

export {
  mapValidatorToRequest,
}
