
import PropTypes from 'prop-types'
import { htCellShape } from './HTCell'

const rowsOfObjectsShape = PropTypes.arrayOf(
  htCellShape,
)

const rowOfPrimitivesShape = PropTypes.arrayOf(
  PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
)

const rowsOfPrimitivesShape = PropTypes.arrayOf(
  rowOfPrimitivesShape,
)

export {
  rowsOfObjectsShape,
  rowsOfPrimitivesShape,
}
