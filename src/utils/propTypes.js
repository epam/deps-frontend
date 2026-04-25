
import PropTypes, { checkPropTypes } from 'prop-types'

const validateValueUsingShape = (
  objectValue,
  valueShape,
  location,
  componentName,
) => {
  if (typeof objectValue === 'object') {
    checkPropTypes(valueShape, objectValue, location, componentName)
    return
  }

  throw new Error(
    'Unable to validate plain value using shapes. Please use validateKey callback to validate such value!',
  )
}

const validateValue = (objectValue, valueShape, location, componentName) => {
  if (Array.isArray(objectValue)) {
    objectValue.forEach((arrayItem) =>
      validateValueUsingShape(arrayItem, valueShape, location, componentName),
    )
    return
  }

  validateValueUsingShape(objectValue, valueShape, location, componentName)
}

const numberAsStringValidator = (value) => {
  if (isNaN(+value)) {
    throw new Error(
      `Value should be a string that holds a valid number. ${value} is not a number`,
    )
  }
}

const dictionaryValidator =
  (validateKey, valueShape) => (props, propName, componentName, location) => {
    Object.keys(props[propName]).forEach((objectKey) => {
      const objectValue = props[propName][objectKey]
      validateKey(objectKey, objectValue)
      valueShape &&
        validateValue(objectValue, valueShape, componentName, location)
    })
  }

const DictionaryShape = (keyShape, valueShape) =>
  PropTypes.shape({
    validator: (props, _, componentName, location, propFullPath) => {
      if (!keyShape || !valueShape) {
        return
      }

      const propName = propFullPath.substring(
        0,
        propFullPath.indexOf('.validator'),
      )

      Object.keys(props).forEach((key) => {
        const keySpec = {
          [key]: keyShape,
        }

        const keyObject = {
          [key]: +key ? +key : key,
        }

        checkPropTypes(keySpec, keyObject, `${propName} key`, componentName)
        checkPropTypes(
          valueShape,
          props[key],
          `${propName}.${key} value`,
          componentName,
        )
      })
    },
  })

const childrenShape = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
  PropTypes.element,
])

export {
  DictionaryShape,
  childrenShape,
  dictionaryValidator,
  numberAsStringValidator,
}
