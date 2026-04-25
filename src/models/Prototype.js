
import PropTypes from 'prop-types'
import { prototypeTableFieldShape } from '@/models/PrototypeTableField'
import { prototypeFieldShape } from './PrototypeField'
import { referenceLayoutShape } from './ReferenceLayout'

class Prototype {
  constructor ({
    id,
    name,
    engine,
    language,
    createdAt,
    description,
    fields,
    tableFields,
    referenceLayouts,
  }) {
    this.id = id
    this.name = name
    this.engine = engine
    this.language = language
    this.createdAt = createdAt
    this.description = description
    this.fields = fields ?? []
    this.tableFields = tableFields ?? []
    this.referenceLayouts = referenceLayouts
  }
}

const prototypeShape = PropTypes.exact({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  engine: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  description: PropTypes.string,
  fields: PropTypes.arrayOf(prototypeFieldShape),
  tableFields: PropTypes.arrayOf(prototypeTableFieldShape),
  referenceLayouts: PropTypes.arrayOf(referenceLayoutShape),
})

export {
  Prototype,
  prototypeShape,
}
