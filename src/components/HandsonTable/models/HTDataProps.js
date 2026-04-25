
import PropTypes from 'prop-types'
import { htColumnShape } from './HTColumn'
import { htMergeShape } from './HTMerge'
import {
  rowsOfObjectsShape,
  rowsOfPrimitivesShape,
} from './HTTableData'

class HTDataProps {
  constructor (data, mergeCells, columns) {
    this.data = data
    this.mergeCells = mergeCells
    this.columns = columns
  }
}

const htDataPropsShape = {
  data: PropTypes.oneOfType(
    [
      rowsOfObjectsShape.isRequired,
      rowsOfPrimitivesShape.isRequired,
    ],
  ).isRequired,
  columns: PropTypes.arrayOf(
    htColumnShape,
  ),
  mergeCells: PropTypes.arrayOf(
    htMergeShape,
  ).isRequired,
}

export {
  HTDataProps,
  htDataPropsShape,
}
