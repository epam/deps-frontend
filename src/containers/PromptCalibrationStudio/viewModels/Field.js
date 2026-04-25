
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'
import { FieldType } from '@/enums/FieldType'
import { Query, queryShape } from './Query'

export const MULTIPLICITY = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
}

export const SUPPORTED_BASE_FIELD_TYPES = [
  FieldType.STRING,
  FieldType.DICTIONARY,
  FieldType.CHECKMARK,
]

export class ListItemValue {
  constructor ({
    content,
    alias,
  }) {
    this.content = content
    this.alias = alias
  }

  static create = (content, alias = null) => new ListItemValue({
    content,
    alias,
  })
}

export class KeyValuePairValue {
  constructor ({
    key,
    value,
  }) {
    this.key = key
    this.value = value
  }

  static create = (key = '', value = '') => (
    new KeyValuePairValue({
      key,
      value,
    })
  )
}

export class Field {
  constructor ({
    id = uuidv4(),
    aliases,
    confidential,
    displayCharLimit,
    extractorId,
    fieldType,
    multiplicity,
    name,
    readOnly,
    required = false,
    value,
    query,
    isNew = false,
    isDirty = false,
    order = 0,
  }) {
    this.id = id
    this.aliases = aliases
    this.confidential = confidential
    this.displayCharLimit = displayCharLimit
    this.extractorId = extractorId
    this.fieldType = fieldType
    this.multiplicity = multiplicity
    this.name = name
    this.readOnly = readOnly
    this.required = required
    this.value = value
    this.query = query
    this.isNew = isNew
    this.isDirty = isDirty
    this.order = order
  }

  static isQueryMutated = (field) => {
    const { nodes, value: executedValue, executedNodes } = field.query

    const valueChanged = executedValue != null && !isEqual(field.value, executedValue)
    const chainChanged = executedNodes != null && !isEqual(nodes, executedNodes)

    return valueChanged || chainChanged
  }

  static isChainSameAsExecuted = (field) => (
    field?.query?.executedNodes != null &&
    isEqual(field.query.nodes, field.query.executedNodes)
  )

  static updateValue = (field, value) => (
    new Field({
      ...field,
      value,
    })
  )

  static createEmpty = (field) => {
    const isMultiple = field.multiplicity === MULTIPLICITY.MULTIPLE

    if (field.fieldType === FieldType.DICTIONARY) {
      const emptyValue = KeyValuePairValue.create()
      const emptyListItem = ListItemValue.create(emptyValue)

      return new Field({
        ...field,
        value: isMultiple ? [emptyListItem] : emptyValue,
        query: new Query(),
        isNew: true,
      })
    }

    if (field.fieldType === FieldType.CHECKMARK) {
      const emptyValue = null
      const emptyListItem = ListItemValue.create(emptyValue)

      return new Field({
        ...field,
        value: isMultiple ? [emptyListItem] : emptyValue,
        query: new Query(),
        isNew: true,
      })
    }

    const emptyValue = ''
    const emptyListItem = ListItemValue.create(emptyValue)

    return new Field({
      ...field,
      value: isMultiple ? [emptyListItem] : emptyValue,
      query: new Query(),
      isNew: true,
    })
  }

  static updateFieldValue = (field) => ({
    ...field,
    query: new Query({
      ...field.query,
      value: null,
    }),
    value: field.query.value,
    isDirty: false,
  })

  static getFieldMultiplicity = (fieldType) => (
    fieldType === FieldType.LIST ? MULTIPLICITY.MULTIPLE : MULTIPLICITY.SINGLE
  )

  static updateName = (field, name) => (
    new Field({
      ...field,
      name,
    })
  )

  static updateExtractor = (field, extractorId) => (
    new Field({
      ...field,
      extractorId,
    })
  )
}

export const keyValuePairValueShape = PropTypes.exact({
  key: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
})

export const listItemShape = PropTypes.shape({
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    keyValuePairValueShape,
  ]),
  alias: PropTypes.string,
})

export const fieldShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  aliases: PropTypes.bool,
  confidential: PropTypes.bool,
  displayCharLimit: PropTypes.number,
  extractorId: PropTypes.string.isRequired,
  fieldType: PropTypes.oneOf(SUPPORTED_BASE_FIELD_TYPES).isRequired,
  multiplicity: PropTypes.oneOf(
    Object.values(MULTIPLICITY),
  ).isRequired,
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    keyValuePairValueShape,
    PropTypes.arrayOf(listItemShape),
  ]),
  query: queryShape,
  isNew: PropTypes.bool,
  isDirty: PropTypes.bool,
})
