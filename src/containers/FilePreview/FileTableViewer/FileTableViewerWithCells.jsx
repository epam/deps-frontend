
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useFetchFileUnifiedDataTableCellsQuery } from '@/apiRTK/filesApi'
import { Empty } from '@/components/Empty'
import { Spin } from '@/components/Spin'
import { UnifiedDataHandsonTable } from '@/containers/UnifiedDataHandsonTable'
import { localize, Localization } from '@/localization/i18n'
import { highlightedFieldSelector } from '@/selectors/fileReviewPage'

const FileTableViewerWithCells = ({
  currentUnifiedData,
}) => {
  const { fileId } = useParams()

  const highlightedField = useSelector(highlightedFieldSelector)

  const shouldFetchCells = currentUnifiedData && !currentUnifiedData.cells

  const {
    data: tableCells,
    isLoading,
    isFetching,
  } = useFetchFileUnifiedDataTableCellsQuery(
    {
      fileId,
      tableId: currentUnifiedData?.id,
      maxRow: currentUnifiedData?.maxRow,
      maxColumn: currentUnifiedData?.maxColumn,
    },
    {
      skip: !shouldFetchCells,
    },
  )

  const enrichedUnifiedData = useMemo(() => {
    if (!tableCells) {
      return currentUnifiedData
    }

    return {
      ...currentUnifiedData,
      cells: tableCells,
    }
  }, [currentUnifiedData, tableCells])

  if (isLoading || isFetching) {
    return <Spin spinning />
  }

  if (!enrichedUnifiedData.cells) {
    return (
      <Empty
        description={localize(Localization.NO_TABLE_CELLS_AVAILABLE)}
      />
    )
  }

  return (
    <UnifiedDataHandsonTable
      highlightedField={highlightedField}
      unifiedData={enrichedUnifiedData}
    />
  )
}

FileTableViewerWithCells.propTypes = {
  currentUnifiedData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    maxRow: PropTypes.number,
    maxColumn: PropTypes.number,
    cells: PropTypes.arrayOf(
      PropTypes.shape({
        coordinates: PropTypes.shape({
          row: PropTypes.number.isRequired,
          column: PropTypes.number.isRequired,
          rowspan: PropTypes.number.isRequired,
          colspan: PropTypes.number.isRequired,
        }),
        value: PropTypes.shape({
          content: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]).isRequired,
          confidence: PropTypes.number.isRequired,
        }),
      }),
    ),
    name: PropTypes.string,
  }).isRequired,
}

export {
  FileTableViewerWithCells,
}
