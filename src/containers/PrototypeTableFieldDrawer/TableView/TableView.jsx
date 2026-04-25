
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { PrototypeTableHeader, TableHeaderType } from '@/models/PrototypeTableField'
import { activeTableSelector } from '@/selectors/prototypePage'
import { TableCell } from './TableCell'
import { Wrapper, Table } from './TableView.styles'

const getRowsData = (cells) => {
  const rowsMap = new Map()

  cells.forEach((cell) => {
    if (!rowsMap.has(cell.rowIndex)) {
      rowsMap.set(cell.rowIndex, [])
    }
    rowsMap.get(cell.rowIndex).push(cell)
  })

  return (
    Array.from(rowsMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([rowIndex, rowCells]) => {
        const row = { key: rowIndex }
        rowCells.forEach((cell) => {
          const colKey = `col_${cell.columnIndex}`
          row[colKey] = cell.content
        })
        return row
      })
  )
}

const getCellId = (colIndex, rowIndex) => `col_${colIndex}_row_${rowIndex}`

const HEADER_ROW_CLASS_NAME = 'header-row'
const HIGHLIGHTED_CLASS_NAME = 'highlighted'
const FIRST_COL_INDEX = 0

const shiftIndex = (index) => index + 1

const TableView = ({
  headerType,
  addHeader,
  removeHeader,
  headersList,
}) => {
  const table = useSelector(activeTableSelector)

  const highlightedIds = headersList.map((h) => h.id)

  const rowsData = useMemo(() => getRowsData(table.cells), [table.cells])

  const headerRowColumns = useMemo(() => {
    const [headerRow] = rowsData

    return Array.from({ length: table.columnCount }, (_, i) => {
      const id = `col_${i}`
      return ({
        title: headerRow[id],
        dataIndex: id,
        key: id,
      })
    })
  }, [
    rowsData,
    table.columnCount,
  ])

  const handleAddHeader = useCallback((name = '', colIndex, rowIndex) => {
    const cellId = getCellId(colIndex, rowIndex)
    const header = new PrototypeTableHeader({
      name,
      aliases: [name],
    })

    addHeader({
      ...header,
      id: `${uuidv4()}_${cellId}`,
    }, { shouldFocus: false })
  }, [addHeader])

  const isMappedToField = useCallback((colIndex, rowIndex) => {
    const cellId = getCellId(colIndex, rowIndex)
    return highlightedIds.some((id) => id.includes(cellId))
  }, [highlightedIds])

  const handleRemoveHeader = useCallback((name, colIndex, rowIndex) => {
    const cellId = getCellId(colIndex, rowIndex)

    const headerIdxToRemove = headersList
      .filter((h) => h.id.includes(cellId))
      .map((h) => headersList.indexOf(h))

    removeHeader(headerIdxToRemove)
  }, [
    headersList,
    removeHeader,
  ])

  const getHighlightClassForCol = useCallback((colIndex, rowIndex) => {
    const isRowHeader = headerType === TableHeaderType.ROWS && colIndex === FIRST_COL_INDEX

    if (isRowHeader) {
      return HEADER_ROW_CLASS_NAME
    }

    return isMappedToField(colIndex, rowIndex) ? HIGHLIGHTED_CLASS_NAME : ''
  }, [headerType, isMappedToField])

  const getHighlightClassForHeaderCell = useCallback((colIndex, rowIndex) => {
    const isColumnHeader = headerType === TableHeaderType.COLUMNS

    if (isColumnHeader) {
      return HEADER_ROW_CLASS_NAME
    }

    return isMappedToField(colIndex, rowIndex) ? HIGHLIGHTED_CLASS_NAME : ''
  }, [headerType, isMappedToField])

  const getHighlightClassForRow = (rowIndex, colIndex = FIRST_COL_INDEX) => (
    isMappedToField(colIndex, shiftIndex(rowIndex)) ? HIGHLIGHTED_CLASS_NAME : ''
  )

  const columns = useMemo(() => {
    const isRowHeaderMode = headerType === TableHeaderType.ROWS
    const isColumnHeaderMode = headerType === TableHeaderType.COLUMNS

    return headerRowColumns.map((col, colIndex) => {
      const headerRowIndex = 0
      const isFirstColumn = colIndex === FIRST_COL_INDEX
      const isHeaderCell = isColumnHeaderMode || (isRowHeaderMode && isFirstColumn)
      const handleAddClick = (text, rowIndex) => handleAddHeader(text, colIndex, rowIndex)
      const handleRemoveClick = (text, rowIndex) => handleRemoveHeader(text, colIndex, rowIndex)

      return {
        ...col,
        title: (
          <TableCell
            isMappedToField={isHeaderCell && isMappedToField(colIndex, headerRowIndex)}
            onAddClick={() => handleAddClick(col.title, headerRowIndex)}
            onRemoveClick={() => handleRemoveClick(col.title, headerRowIndex)}
            showActionButton={isHeaderCell}
            text={col.title}
          />
        ),
        onHeaderCell: () => ({
          className: getHighlightClassForHeaderCell(FIRST_COL_INDEX, headerRowIndex),
        }),
        className: getHighlightClassForCol(colIndex, headerRowIndex),
        render: (text, _, index) => {
          const rowIndex = shiftIndex(index)
          const isRowHeaderCell = isRowHeaderMode && isFirstColumn
          return (
            <TableCell
              isMappedToField={isRowHeaderCell && isMappedToField(colIndex, rowIndex)}
              onAddClick={() => handleAddClick(text, rowIndex)}
              onRemoveClick={() => handleRemoveClick(text, rowIndex)}
              showActionButton={isRowHeaderCell}
              text={text}
            />
          )
        },
      }
    })
  }, [
    headerType,
    headerRowColumns,
    handleAddHeader,
    handleRemoveHeader,
    isMappedToField,
    getHighlightClassForCol,
    getHighlightClassForHeaderCell,
  ])

  return (
    <Wrapper>
      <Table
        columns={columns}
        data={rowsData.slice(1)}
        pagination={false}
        rowClassName={(_, rowIndex) => getHighlightClassForRow(rowIndex)}
      />
    </Wrapper>
  )
}

TableView.propTypes = {
  headerType: PropTypes.oneOf(
    Object.values(TableHeaderType),
  ).isRequired,
  addHeader: PropTypes.func.isRequired,
  removeHeader: PropTypes.func.isRequired,
  headersList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      aliases: PropTypes.arrayOf(
        PropTypes.string,
      ).isRequired,
    }),
  ).isRequired,
}

export {
  TableView,
}
