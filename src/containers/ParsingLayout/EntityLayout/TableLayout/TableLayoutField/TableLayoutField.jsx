
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { InView } from '@/containers/InView'
import { useHighlightCoords, useLayoutMutation } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { withFlexibleParentSize } from '@/hocs/withParentSize'
import {
  mapTableLayoutCellsToHandsonDataStrings,
  mapTableLayoutCellsToPolygons,
} from '@/models/DocumentLayout/mappers'
import { tableLayoutShape } from '@/models/DocumentLayout/TableLayout'
import { StyledHandsonTable } from './TableLayoutField.styles'

const Table = withFlexibleParentSize({
  height: 'fit-content',
})((props) => (
  <StyledHandsonTable
    {...props}
  />
))

const PROPS_FOR_UPDATE = ['data', 'mergeCells', 'selectedRanges', 'width']

const getInitialPositionByIndexes = (table, rowIndex, columnIndex) => (
  table.cells.find((cell) => cell.rowIndex === rowIndex && cell.columnIndex === columnIndex).initialPosition
)

const TableLayoutField = ({
  alignHeightByContent,
  table,
  parsingType,
}) => {
  const { isEditable, updateTable } = useLayoutMutation(parsingType)

  const { highlightCoords } = useHighlightCoords()

  const { data, mergeCells } = useMemo(
    () => mapTableLayoutCellsToHandsonDataStrings(table),
    [table],
  )

  const onSelectRange = useCallback(([range]) => {
    const { coords, page } = mapTableLayoutCellsToPolygons(table.cells, range)

    highlightCoords({
      field: coords,
      page,
    })
  }, [
    highlightCoords,
    table.cells,
  ])

  const saveData = useCallback(async (_, __, cellChanges) => {
    const cells = cellChanges.map(([row, col, , newValue]) => {
      const initialPosition = getInitialPositionByIndexes(table, row, col)
      return {
        content: newValue,
        rowIndex: initialPosition.rowIndex,
        columnIndex: initialPosition.columnIndex,
        tableId: initialPosition.tableId,
        pageId: initialPosition.pageId,
      }
    })

    const payloads = cells.reduce((acc, cell) => {
      const existingPayload = acc.find((payload) => payload.tableId === cell.tableId)

      if (existingPayload) {
        existingPayload.cells.push(cell)
      } else {
        acc.push({
          tableId: cell.tableId,
          pageId: cell.pageId,
          cells: [{
            rowIndex: cell.rowIndex,
            columnIndex: cell.columnIndex,
            content: cell.content,
          }],
        })
      }

      return acc
    }, [])

    await Promise.all(
      payloads.map((payload) => {
        return updateTable({
          pageId: payload.pageId,
          tableId: payload.tableId,
          body: { cells: payload.cells },
        })
      }),
    )
  }, [table, updateTable])

  return (
    <InView>
      <Table
        alignHeightByContent={alignHeightByContent}
        contextMenuEnabled={false}
        data={data}
        mergeCells={mergeCells}
        onSelectRange={onSelectRange}
        propsForUpdate={PROPS_FOR_UPDATE}
        readOnly={!isEditable}
        saveData={saveData}
      />
    </InView>
  )
}

TableLayoutField.propTypes = {
  alignHeightByContent: PropTypes.bool,
  table: tableLayoutShape.isRequired,
  parsingType: PropTypes.oneOf(
    Object.values(DOCUMENT_LAYOUT_PARSING_TYPE),
  ).isRequired,
}

export { TableLayoutField }
