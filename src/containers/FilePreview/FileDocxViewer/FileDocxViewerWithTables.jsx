
import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useFetchFileUnifiedDataQuery, useLazyFetchFileUnifiedDataTableCellsQuery } from '@/apiRTK/filesApi'
import { Spin } from '@/components/Spin'
import { UNIFIED_DATA_CELLS_BATCH_SIZE } from '@/constants/document'
import { Slate } from '@/containers/Slate'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { localize, Localization } from '@/localization/i18n'
import { mapUDToSlateData } from '@/models/UnifiedData/mappers/mapUDToSlateData'
import { chunkArray } from '@/utils/array'
import { notifyWarning } from '@/utils/notification'
import { Content } from './FileDocxViewer.styles'

const FileDocxViewerWithTables = ({ notReadyTables }) => {
  const { fileId } = useParams()

  const { data: unifiedData } = useFetchFileUnifiedDataQuery(fileId)

  const [
    fetchTableCells,
    { isLoading, isFetching },
  ] = useLazyFetchFileUnifiedDataTableCellsQuery()

  const [tableCellsData, setTableCellsData] = useState({})

  useEffect(() => {
    const fetchAllTables = async () => {
      try {
        const batches = chunkArray(notReadyTables, UNIFIED_DATA_CELLS_BATCH_SIZE)
        const allResults = []

        for (const batch of batches) {
          const batchResults = await Promise.all(
            batch.map(async (table) => {
              const result = await fetchTableCells({
                fileId,
                tableId: table.id,
                maxRow: table.maxRow,
                maxColumn: table.maxColumn,
              }).unwrap()

              return {
                id: table.id,
                cells: result,
              }
            }),
          )
          allResults.push(...batchResults)
        }

        const cellsData = allResults.reduce((acc, { id, cells }) => ({
          ...acc,
          [id]: cells,
        }), {})

        setTableCellsData(cellsData)
      } catch (e) {
        const errorCode = e?.data?.code
        const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.EXTRACT_TABLE_DATA_FAILED)
        notifyWarning(message)
      }
    }

    fetchAllTables()
  }, [fileId, notReadyTables, fetchTableCells])

  const allTablesLoaded = useMemo(
    () => notReadyTables.every((table) => tableCellsData[table.id]),
    [notReadyTables, tableCellsData],
  )

  const isLoadingTableCells = !allTablesLoaded || isLoading || isFetching

  const enrichedUnifiedData = useMemo(() => {
    if (isLoadingTableCells) {
      return unifiedData
    }

    const tablesData = notReadyTables.map((table) => ({
      cells: tableCellsData[table.id],
      tableId: table.id,
    }))

    const tableIdToPage = Object.entries(unifiedData).reduce((map, [page, tables]) => {
      tables.forEach((table) => {
        map[table.id] = page
      })
      return map
    }, {})

    return tablesData.reduce((acc, { tableId, cells }) => {
      if (!cells) {
        return acc
      }

      const page = tableIdToPage[tableId]
      if (!page || !acc[page]) {
        return acc
      }

      const pageUnifiedData = acc[page]
      const updatedPageUnifiedData = pageUnifiedData.map((ud) => (
        ud.id === tableId ? {
          ...ud,
          cells,
        } : ud
      ))

      return {
        ...acc,
        [page]: updatedPageUnifiedData,
      }
    }, unifiedData)
  }, [unifiedData, isLoadingTableCells, notReadyTables, tableCellsData])

  const flatUnifiedData = useMemo(() => Object.values(enrichedUnifiedData).flat(), [enrichedUnifiedData])

  const value = useMemo(() => {
    if (!flatUnifiedData.length || isLoadingTableCells) {
      return null
    }
    return mapUDToSlateData(flatUnifiedData)
  }, [flatUnifiedData, isLoadingTableCells])

  if (!value || isLoadingTableCells) {
    return <Spin spinning />
  }

  return (
    <Content>
      <Slate value={value} />
    </Content>
  )
}

FileDocxViewerWithTables.propTypes = {
  notReadyTables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      maxRow: PropTypes.number.isRequired,
      maxColumn: PropTypes.number.isRequired,
    }),
  ).isRequired,
}

export {
  FileDocxViewerWithTables,
}
