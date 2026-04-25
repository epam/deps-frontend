
import PropTypes from 'prop-types'
import { DEFAULT_DATE_FORMAT } from '@/constants/common'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'

class EnumFieldDescription {
  constructor (
    options = [''],
    displayCharLimit,
  ) {
    this.options = options
    displayCharLimit && (this.displayCharLimit = displayCharLimit)
  }
}

class DateFieldDescription {
  constructor (
    format = DEFAULT_DATE_FORMAT,
    displayCharLimit,
  ) {
    this.format = format
    displayCharLimit && (this.displayCharLimit = displayCharLimit)
  }
}

class ListFieldDescription {
  constructor (
    baseType,
    baseTypeMeta,
  ) {
    this.baseType = baseType
    this.baseTypeMeta = baseTypeMeta
  }
}

class PrototypeFieldType {
  constructor ({
    typeCode,
    description,
  }) {
    this.typeCode = typeCode
    this.description = description
  }
}

const enumFieldDescriptionShape = PropTypes.shape({
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  displayCharLimit: PropTypes.number,
})

const dateFieldDescriptionShape = PropTypes.shape({
  format: PropTypes.string.isRequired,
  displayCharLimit: PropTypes.number,
})

const prototypeFieldTypeShape = PropTypes.exact({
  typeCode: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([
    dateFieldDescriptionShape,
    enumFieldDescriptionShape,
    PropTypes.object,
  ]).isRequired,
})

class PrototypeFieldMapping {
  constructor ({
    keys,
    mappingDataType,
    mappingType,
  }) {
    this.keys = keys
    this.mappingDataType = mappingDataType
    this.mappingType = mappingType
  }
}

const prototypeFieldMappingShape = PropTypes.exact({
  mappingDataType: PropTypes.oneOf(Object.values(FieldType)).isRequired,
  mappingType: PropTypes.oneOf(Object.values(MappingType)).isRequired,
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
})

class PrototypeField {
  constructor ({
    id,
    prototypeId,
    name,
    fieldType,
    mapping,
    required = false,
    readOnly = false,
    confidential = false,
    order = 0,
  }) {
    this.id = id
    this.prototypeId = prototypeId
    this.name = name
    this.fieldType = fieldType
    this.mapping = mapping
    this.order = order
    this.required = required
    this.readOnly = readOnly
    this.confidential = confidential
  }
}

const prototypeFieldShape = PropTypes.exact({
  id: PropTypes.string.isRequired,
  prototypeId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  fieldType: prototypeFieldTypeShape.isRequired,
  mapping: prototypeFieldMappingShape.isRequired,
  required: PropTypes.bool.isRequired,
  order: PropTypes.number.isRequired,
  readOnly: PropTypes.bool,
  confidential: PropTypes.bool,
})

export {
  PrototypeFieldType,
  prototypeFieldTypeShape,
  PrototypeFieldMapping,
  prototypeFieldMappingShape,
  PrototypeField,
  prototypeFieldShape,
  DateFieldDescription,
  EnumFieldDescription,
  ListFieldDescription,
}
