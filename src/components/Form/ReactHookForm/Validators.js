
import PropTypes from 'prop-types'
import { Localization, localize } from '@/localization/i18n'

class MaxLengthValidator {
  constructor (
    value = 128,
    message = localize(Localization.MAX_LENGTH_VALIDATOR_ERROR_MESSAGE, { value }),
  ) {
    this.maxLength = {
      value: value,
      message: message,
    }
  }
}

class RequiredValidator {
  constructor (
    message = localize(Localization.REQUIRED_VALIDATOR_ERROR_MESSAGE),
  ) {
    this.required = {
      value: true,
      message: message,
    }
  }
}

class PatternValidator {
  constructor (value, message) {
    this.pattern = {
      value: value,
      message: message,
    }
  }
}

const maxLengthValidatorShape = PropTypes.shape({
  maxLength: PropTypes.instanceOf({
    value: PropTypes.number,
    message: PropTypes.string,
  }),
})

const requiredValidatorShape = PropTypes.shape({
  isRequired: PropTypes.shape({
    value: PropTypes.bool,
    message: PropTypes.string,
  }),
})

const patternValidatorShape = PropTypes.shape({
  pattern: PropTypes.shape({
    value: PropTypes.instanceOf(RegExp),
    message: PropTypes.string,
  }),
})

export {
  MaxLengthValidator,
  RequiredValidator,
  PatternValidator,
  maxLengthValidatorShape,
  requiredValidatorShape,
  patternValidatorShape,
}
