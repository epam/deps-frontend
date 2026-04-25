import {
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { HandsonTable } from '@/components/HandsonTable'
import { withParentSize } from '@/hocs/withParentSize'
import { unifiedDataShape } from '@/models/Document'
import { DocumentTable } from '@/models/DocumentTable'
import { highlightedTableCoordsShape } from '@/models/HighlightedField'
import { mapUDCellsToHandsonData } from '@/models/UnifiedData/mappers/mapUDCellsToHandsonData'
import { ENV } from '@/utils/env'

const propsForUpdate = ['data', 'selectedRanges', 'width']

const MAX_CONTENT_LENGTH = ENV.DEFAULT_MAX_CELL_CONTENT_LENGTH

class ColumnLengthManager {
  maxContentLength = MAX_CONTENT_LENGTH

  constructor (columns) {
    this.columns = Array.from(
      {
        length: columns,
      },
      () => (
        this.maxContentLength
      ),
    )
  }

  getContentLengthByColumn = (columnIndex) => (
    this.columns[columnIndex]
  )

  #setColumnLength = (length, columnIndex) => {
    this.columns[columnIndex] = length
  }

  #setColumnLengthByContent = (columnContent, index) => {
    const maxLength = Math.max(...columnContent.map((c) => c.length), this.maxContentLength)

    this.#setColumnLength(maxLength, index)
  }

  updateColumnLengths = (columnConfig) => {
    this.columns.forEach((_, column) => {
      if (column in columnConfig) {
        return this.#setColumnLengthByContent(columnConfig[column], column)
      }

      this.#setColumnLength(this.maxContentLength, column)
    })
  }
}

const areCoordsEqual = (coords1, coords2) => {
  if (!coords1 || !coords2) {
    return
  }

  return (
    coords1.every(([row1, col1]) => coords2.find(([row2, col2]) => row2 === row1 && col2 === col1)) &&
    coords2.every(([row1, col1]) => coords1.find(([row2, col2]) => row2 === row1 && col2 === col1))
  )
}

const getReducedValue = (value, sliceTo = MAX_CONTENT_LENGTH) => value && `${value.trim().slice(0, sliceTo)}...`
const shouldShortenValue = (value, cutTo = MAX_CONTENT_LENGTH) => value && value.trim().length > cutTo

const SizedTable = withParentSize({
  noPlaceholder: true,
  monitorHeight: true,
})((props) => (
  <HandsonTable
    {...props}
    height={props.size.height}
    width={props.size.width}
  />
))

const UnifiedDataHandsonTable = ({
  unifiedData,
  highlightedField,
}) => {
  const [selected, setSelected] = useState([])

  const { data, mergeCells } = useMemo(() => (
    mapUDCellsToHandsonData(unifiedData.cells)
  ), [unifiedData.cells])

  const colWidthManager = useMemo(() => (
    new ColumnLengthManager(data[0].length)
  ), [data])

  useEffect(() => {
    highlightedField && setSelected(highlightedField)
  }, [highlightedField])

  const udTableData = useMemo(() => {
    if (!ENV.FEATURE_COLLAPSIBLE_SELECTED_CELLS) {
      return data
    }

    return data.map((row, rowIndex) => (
      row.map((cell, colIndex) => {
        if (shouldShortenValue(cell, colWidthManager.getContentLengthByColumn(colIndex)) &&
        (
          !selected.find(([row, col]) => row === rowIndex && col === colIndex)
        )) {
          return getReducedValue(cell, colWidthManager.getContentLengthByColumn(colIndex))
        }

        return cell && cell.trim()
      })
    ))
  }, [
    data,
    selected,
    colWidthManager,
  ])

  const highlighted = useMemo(() => (
    areCoordsEqual(selected, highlightedField) ? highlightedField : []
  ), [selected, highlightedField])

  const onSelectRange = useCallback((ranges) => {
    const cells = ranges.flatMap((range) => DocumentTable.getCellCoordinatesByRange(unifiedData, range))

    if (ENV.FEATURE_COLLAPSIBLE_SELECTED_CELLS) {
      const columnConfig = cells.reduce((acc, [row, col]) => {
        if (!acc[col]) {
          acc[col] = []
        }
        acc[col].push(data[row][col])
        return acc
      }, {})

      colWidthManager.updateColumnLengths(columnConfig)
    }

    setSelected(cells)
  }, [
    unifiedData,
    data,
    colWidthManager,
  ])

  return (
    <SizedTable
      data={udTableData}
      mergeCells={mergeCells}
      onSelectRange={onSelectRange}
      outsideClickDeselects={false}
      propsForUpdate={propsForUpdate}
      readOnly
      selectedRanges={highlighted}
    />
  )
}

UnifiedDataHandsonTable.propTypes = {
  highlightedField: highlightedTableCoordsShape,
  unifiedData: unifiedDataShape.isRequired,
}

export {
  UnifiedDataHandsonTable,
}
