
import { useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { fetchUnifiedDataCells } from '@/actions/documents'
import { Spin } from '@/components/Spin'
import { Slate } from '@/containers/Slate'
import { mapUDToSlateData } from '@/models/UnifiedData/mappers/mapUDToSlateData'
import { documentSelector } from '@/selectors/documentReviewPage'
import { Content } from './DocumentDocxViewer.styles'

const DocumentDocxViewer = () => {
  const dispatch = useDispatch()

  const { documentId } = useParams()

  const document = useSelector(documentSelector)

  const flatUnifiedData = useMemo(() => (
    Object.values(document.unifiedData).flat()
  ), [document.unifiedData])

  const notReadyTables = useMemo(() => (
    flatUnifiedData.filter((ud) => ud.maxRow && !ud.cells)
  ), [flatUnifiedData])

  useEffect(() => {
    if (!notReadyTables.length) {
      return
    }

    const notReadyTableConfigs = notReadyTables.map((tableData) => ({
      tableId: tableData.id,
      maxRow: tableData.maxRow,
      maxColumn: tableData.maxColumn,
    }))

    dispatch(
      fetchUnifiedDataCells({
        documentId: documentId,
        tableConfigs: notReadyTableConfigs,
      }),
    )
  }, [
    dispatch,
    notReadyTables,
    documentId,
  ])

  const value = useMemo(() => (
    !notReadyTables.length && mapUDToSlateData(flatUnifiedData)
  ), [
    flatUnifiedData,
    notReadyTables,
  ])

  if (notReadyTables.length) {
    return <Spin spinning />
  }

  return (
    <Content>
      <Slate
        value={value}
      />
    </Content>
  )
}

export {
  DocumentDocxViewer,
}
