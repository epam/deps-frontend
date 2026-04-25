
import PropTypes from 'prop-types'

class Template {
  constructor ({
    id,
    name,
    language,
    engine,
    groupId,
    description,
    createdAt,
  }) {
    this.id = id
    this.name = name
    this.language = language
    this.engine = engine
    this.groupId = groupId
    this.description = description
    this.createdAt = createdAt
  }

  static toOption = (template) => ({
    value: template.id,
    text: template.name,
  })
}

const templateShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  engine: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  description: PropTypes.string,
})

export {
  Template,
  templateShape,
}
