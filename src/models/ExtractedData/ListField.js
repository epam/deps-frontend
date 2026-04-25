
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'

class ListField {
  static isValid = (edField) => (
    has(edField, 'fieldPk') &&
    has(edField, 'data') &&
    edField.data.length
  )

  static isEmpty = (fieldData) => (
    isEmpty(fieldData) || !fieldData.length
  )

  static getSubFieldById = (edField, id) => (
    edField.data.find((f) => f.id === id)
  )

  static replaceSubField = (edField, prevSubField, newSubField) => ({
    ...edField,
    data: edField.data.map(
      (f) => f.id === prevSubField.data.id ? newSubField : f,
    ),
  })
}

export { ListField }
