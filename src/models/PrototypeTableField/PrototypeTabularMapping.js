
import PropTypes from 'prop-types'

class PrototypeTabularMapping {
  constructor ({
    headerType,
    headers,
    occurrenceIndex = 0,
  }) {
    this.headerType = headerType
    this.headers = headers
    this.occurrenceIndex = occurrenceIndex
  }
}

class PrototypeTableHeader {
  constructor ({
    name = '',
    aliases = [],
  }) {
    this.name = name
    this.aliases = aliases
  }
}

const TableHeaderType = {
  ROWS: 'rows',
  COLUMNS: 'columns',
}

const prototypeTableHeaderShape = PropTypes.exact({
  name: PropTypes.string.isRequired,
  aliases: PropTypes.arrayOf(PropTypes.string),
})

const prototypeTabularMappingShape = PropTypes.exact({
  headerType: PropTypes.oneOf(Object.values(TableHeaderType)).isRequired,
  occurrenceIndex: PropTypes.number.isRequired,
  headers: PropTypes.arrayOf(prototypeTableHeaderShape).isRequired,
})

export {
  PrototypeTabularMapping,
  PrototypeTableHeader,
  prototypeTabularMappingShape,
  TableHeaderType,
}
