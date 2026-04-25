
import PropTypes from 'prop-types'
import { documentTypeFieldShape } from './DocumentTypeField'

class MachineLearningModel {
  constructor ({
    id,
    createdAt,
    name,
    code,
    language,
    engine,
    fields,
  }) {
    this.id = id
    this.createdAt = createdAt
    this.name = name
    this.code = code
    this.language = language
    this.engine = engine
    this.fields = fields
  }
}

const machineLearningModelShape = PropTypes.shape({
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  createdAt: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  language: PropTypes.string,
  engine: PropTypes.string,
  fields: PropTypes.arrayOf(documentTypeFieldShape),
})

export {
  MachineLearningModel,
  machineLearningModelShape,
}
