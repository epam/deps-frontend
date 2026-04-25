
import PropTypes from 'prop-types'

class MaxValidator {
  constructor (length = 128, message) {
    this.max = length
    this.message = message || `The value should be no longer than ${length} characters.`
  }
}

class RequiredValidator {
  constructor (message = 'The value is required.') {
    this.required = true
    this.message = message
  }
}

class AlphaNumericValidator {
  constructor (message = 'Only latin characters, numbers and "_", "-" symbols are allowed.') {
    this.pattern = new RegExp(/^[a-z0-9-_]+$/, 'i')
    this.message = message
  }
}

class WhitespaceValidator {
  constructor (message = 'The value should not be empty.') {
    this.whitespace = true
    this.message = message
  }
}

class UniqueSymbolValidator {
  constructor (message = 'Characters in this field should be unique.') {
    this.message = message
  }

  validator = (self, value, done) => {
    if (!value || !value.split) {
      return done()
    }

    const chars = value.split('')
    const unique = chars.filter((ch, i) => chars.indexOf(ch) === i)
    if (chars.length === unique.length) {
      return done()
    }

    return done(this.message)
  }
}

const maxValidatorShape = PropTypes.shape({
  max: PropTypes.number,
  message: PropTypes.string,
})

const requiredValidatorShape = PropTypes.shape({
  required: PropTypes.bool,
  message: PropTypes.string,
})

const alphaNumericValidatorShape = PropTypes.shape({
  pattern: PropTypes.instanceOf(RegExp),
  message: PropTypes.string,
})

const whitespaceValidatorShape = PropTypes.shape({
  whitespace: PropTypes.bool,
  message: PropTypes.string,
})

const uniqueSymbolValidatorShape = PropTypes.shape({
  validator: PropTypes.func,
  message: PropTypes.string,
})

export {
  MaxValidator,
  RequiredValidator,
  AlphaNumericValidator,
  WhitespaceValidator,
  UniqueSymbolValidator,
  maxValidatorShape,
  requiredValidatorShape,
  alphaNumericValidatorShape,
  whitespaceValidatorShape,
  uniqueSymbolValidatorShape,
}
