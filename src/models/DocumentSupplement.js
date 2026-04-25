
import PropTypes from 'prop-types'
import { FieldType } from '@/enums/FieldType'

class DocumentSupplement {
  constructor ({
    code,
    name,
    type,
    value,
  }) {
    this.code = code
    this.name = name
    this.type = type
    this.value = value
  }
}

const documentSupplementShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(
    Object.values(FieldType),
  ).isRequired,
  value: PropTypes.string.isRequired,
})

export {
  DocumentSupplement,
  documentSupplementShape,
}
