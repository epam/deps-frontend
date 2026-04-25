
import PropTypes from 'prop-types'
import { useMemo, useState, memo } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getTabularLayout, getFileTabularLayout } from '@/api/parsingApi'
import { HandsonTable, withInfiniteLoad } from '@/components/HandsonTable'
import { useReviewActions } from '@/containers/ParsingLayout/hooks'
import { withParentSize } from '@/hocs/withParentSize'
import { Localization, localize } from '@/localization/i18n'
import { tableDataShape, tableSchemaShape } from '@/models/TabularLayout'
import { notifyWarning } from '@/utils/notification'
import { TabularLayoutRequestConfig } from '../TabularLayoutRequestConfig'
import {
  mapSelectedRangeToTabularLayoutCell,
  mapTabularLayoutCellsToHandsonTableData,
} from './mappers'
import { Wrapper } from './TableField.styles'

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

const Table = withInfiniteLoad(SizedTable)

const TableField = memo(({
  schema,
  initialData,
  sheetIndex,
}) => {
  const [tableData, setTableData] = useState(initialData)
  const [areRowsLoading, setAreRowsLoading] = useState(false)
  const [areColumnsLoading, setAreColumnsLoading] = useState(false)

  const dispatch = useDispatch()

  const { highlightTableCoordsField } = useReviewActions()

  const { documentId, fileId } = useParams()
  const entityId = documentId || fileId
  const getLayoutFunction = fileId ? getFileTabularLayout : getTabularLayout

  const { data: htData, mergeCells } = useMemo(() =>
    mapTabularLayoutCellsToHandsonTableData(tableData),
  [tableData],
  )

  const { rowCount, columnCount, id: tableId } = schema

  const fetchTable = async ({ rowSpan, colSpan }) => {
    if (areColumnsLoading || areRowsLoading || !entityId) {
      return
    }

    try {
      colSpan && setAreColumnsLoading(true)
      rowSpan && setAreRowsLoading(true)

      const config = new TabularLayoutRequestConfig({
        tables: [tableId],
        rowSpan,
        colSpan,
      })

      const { tables } = await getLayoutFunction(entityId, config)
      setTableData((prevData) => [...prevData, ...tables[tableId].data])
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      colSpan && setAreColumnsLoading(false)
      rowSpan && setAreRowsLoading(false)
    }
  }

  const onSelectRange = ([range]) => {
    const cells = mapSelectedRangeToTabularLayoutCell(tableData, range)
    const coords = cells.map(([y, x]) => [x, y])

    dispatch(highlightTableCoordsField({
      field: coords,
      page: sheetIndex + 1,
    }))
  }

  return (
    <Wrapper>
      <Table
        areColumnsLoading={areColumnsLoading}
        areRowsLoading={areRowsLoading}
        columnCount={columnCount}
        data={htData}
        fetchMoreData={fetchTable}
        mergeCells={mergeCells}
        onSelectRange={onSelectRange}
        rowCount={rowCount}
      />
    </Wrapper>
  )
})

TableField.propTypes = {
  initialData: tableDataShape.isRequired,
  schema: tableSchemaShape.isRequired,
  sheetIndex: PropTypes.number.isRequired,
}

export {
  TableField,
}
