
import PropTypes from 'prop-types'
import { prototypeTabularMappingShape } from './PrototypeTabularMapping'

class PrototypeTableField {
  constructor ({
    id,
    prototypeId,
    name,
    fieldType,
    tabularMapping,
    required = false,
    readOnly = false,
    confidential = false,
    order = 0,
  }) {
    this.id = id
    this.prototypeId = prototypeId
    this.name = name
    this.fieldType = fieldType
    this.tabularMapping = tabularMapping
    this.order = order
    this.required = required
    this.readOnly = readOnly
    this.confidential = confidential
  }
}

const fieldTypeShape = PropTypes.exact({
  typeCode: PropTypes.string.isRequired,
  description: PropTypes.object.isRequired,
})

const prototypeTableFieldShape = PropTypes.exact({
  id: PropTypes.string.isRequired,
  prototypeId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  fieldType: fieldTypeShape.isRequired,
  tabularMapping: prototypeTabularMappingShape,
  required: PropTypes.bool.isRequired,
  order: PropTypes.number.isRequired,
  readOnly: PropTypes.bool,
  confidential: PropTypes.bool,
})

export {
  PrototypeTableField,
  prototypeTableFieldShape,
}
