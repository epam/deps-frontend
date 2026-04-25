
import PropTypes from 'prop-types'
import { sourceBboxCoordinatesShape, sourceTableCoordinatesShape } from '@/models/SourceCoordinates'
import { tableCoordinatesShape } from '@/models/TableCoordinates'

class HTCell {
  constructor (value = '', meta = {}) {
    this.value = value
    this.meta = meta
  }
}

const htCellShape = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  meta: PropTypes.shape({
    confidence: PropTypes.number,
    tableCoordinates: PropTypes.arrayOf(tableCoordinatesShape),
    sourceBboxCoordinates: PropTypes.arrayOf(sourceBboxCoordinatesShape),
    sourceTableCoordinates: PropTypes.arrayOf(sourceTableCoordinatesShape),
    pk: PropTypes.string,
  }),
})

export {
  HTCell,
  htCellShape,
}
