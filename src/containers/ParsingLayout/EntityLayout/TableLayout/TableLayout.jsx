
import PropTypes from 'prop-types'
import {
  useCallback,
  useState,
} from 'react'
import { DOCUMENT_LAYOUT_FEATURE, DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { InfiniteScrollLayout } from '../InfiniteScrollLayout'
import { LocalErrorBoundary } from '../LocalErrorBoundary'
import { mergeTableChunk } from './mergeTableChunk'
import { TableLayoutField } from './TableLayoutField'

const enrichTableLayoutWithPageContext = (data) =>
  data.map(({ page, pageId, layout }) => ({
    ...layout,
    cells: layout.cells.map((cell) => ({
      ...cell,
      page,
      initialPosition: {
        pageId,
        rowIndex: cell.rowIndex,
        columnIndex: cell.columnIndex,
        tableId: layout.id,
      },
    })),
  }))

const TableLayout = ({
  parsingType,
  mergedTables,
  total,
}) => {
  const [layoutData, setLayoutData] = useState([])

  const setLayout = useCallback((layoutData) => {
    const newTables = enrichTableLayoutWithPageContext(layoutData)

    newTables.forEach((table) => {
      const parentTableId = mergedTables.find((item) => item.tableId === table.id)?.parentId

      if (!parentTableId) {
        setLayoutData((prevData) => [...prevData, table])
        return
      }

      setLayoutData((prevData) => mergeTableChunk(prevData, table, parentTableId))
    })
  }, [
    mergedTables,
  ])

  const isParentTable = useCallback(
    (tableId) => !!mergedTables.find((item) => item.parentId === tableId),
    [mergedTables],
  )

  return (
    <InfiniteScrollLayout
      parsingFeature={DOCUMENT_LAYOUT_FEATURE.TABLES}
      parsingType={parsingType}
      setLayout={setLayout}
      showEmpty={!layoutData.length}
      total={total}
    >
      {
        layoutData.map((table, i) => {
          return (
            <LocalErrorBoundary key={i}>
              <TableLayoutField
                alignHeightByContent={isParentTable(table.id)}
                parsingType={parsingType}
                table={table}
              />
            </LocalErrorBoundary>
          )
        })
      }
    </InfiniteScrollLayout>
  )
}

TableLayout.propTypes = {
  mergedTables: PropTypes.arrayOf(
    PropTypes.shape({
      parentId: PropTypes.string.isRequired,
      tableId: PropTypes.string.isRequired,
    }),
  ),
  parsingType: PropTypes.oneOf(
    Object.values(DOCUMENT_LAYOUT_PARSING_TYPE),
  ).isRequired,
  total: PropTypes.number.isRequired,
}

export {
  TableLayout,
}
