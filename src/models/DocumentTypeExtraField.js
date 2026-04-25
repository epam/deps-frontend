
import PropTypes from 'prop-types'
import { FieldType } from '@/enums/FieldType'

class DocumentTypeExtraField {
  constructor ({
    code,
    name,
    type = FieldType.STRING,
    order,
    autoFilled = false,
  }) {
    this.code = code
    this.name = name
    this.type = type
    this.order = order
    this.autoFilled = autoFilled
  }
}

const documentTypeExtraFieldShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  type: PropTypes.oneOf(
    Object.values(FieldType),
  ).isRequired,
  autoFilled: PropTypes.bool.isRequired,
})

export {
  DocumentTypeExtraField,
  documentTypeExtraFieldShape,
}
