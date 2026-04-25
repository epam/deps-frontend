
import PropTypes from 'prop-types'
import { memo, useCallback } from 'react'
import { connect } from 'react-redux'
import { UiKeys } from '@/constants/navigation'
import { slateAttributesShape, slateCellElementShape } from '@/containers/Slate/models'
import { HighlightedField, highlightedTableCoordsShape } from '@/models/HighlightedField'
import { uiSelector } from '@/selectors/navigation'
import { highlightedFieldSelector } from '@/selectors/reviewPage'
import { childrenShape } from '@/utils/propTypes'
import { StyledCell, StyledHighlightedCell } from './Table.styles'

const Cell = ({ attributes, children, element, activeSourceId, highlightedField }) => {
  const isInRange = useCallback(() => (
    highlightedField?.some(([startRow, startCol]) => (
      startRow === element.coordinates.row &&
      startCol === element.coordinates.column
    ))
  ), [highlightedField, element])

  const shouldCellBeHighlighted = (
    activeSourceId === element.tableId &&
    (
      highlightedField && HighlightedField.isRanges(highlightedField)
    ) &&
    !!isInRange()
  )

  const CellElement = shouldCellBeHighlighted ? StyledHighlightedCell : StyledCell

  return (
    <CellElement
      {...attributes}
      {...element.attributes}
    >
      {children}
    </CellElement>
  )
}

const mapStateToProps = (state) => ({
  activeSourceId: uiSelector(state)[UiKeys.ACTIVE_SOURCE_ID],
  highlightedField: highlightedFieldSelector(state),
})

const comparer = (prevProps, nextProps) => {
  const selfSourceId = prevProps.element.tableId

  const wereSourceIdsEqual = prevProps.activeSourceId === selfSourceId
  const isActiveIdEqualToPrev = nextProps.activeSourceId === selfSourceId

  return !(wereSourceIdsEqual || isActiveIdEqualToPrev)
}

const memoizedCell = memo(Cell, comparer)

const ConnectedComponent = connect(mapStateToProps)(memoizedCell)

Cell.propTypes = {
  attributes: slateAttributesShape.isRequired,
  children: childrenShape.isRequired,
  element: slateCellElementShape.isRequired,
  highlightedField: highlightedTableCoordsShape,
  activeSourceId: PropTypes.string,
}

export { ConnectedComponent as Cell }
