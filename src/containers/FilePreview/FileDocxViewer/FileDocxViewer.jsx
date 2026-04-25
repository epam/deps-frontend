
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { useFetchFileUnifiedDataQuery } from '@/apiRTK/filesApi'
import { Spin } from '@/components/Spin'
import { Slate } from '@/containers/Slate'
import { mapUDToSlateData } from '@/models/UnifiedData/mappers/mapUDToSlateData'
import { Content } from './FileDocxViewer.styles'
import { FileDocxViewerWithTables } from './FileDocxViewerWithTables'

const FileDocxViewer = () => {
  const { fileId } = useParams()

  const {
    data: unifiedData,
    isLoading: isLoadingUnifiedData,
  } = useFetchFileUnifiedDataQuery(fileId)

  const flatUnifiedData = useMemo(() => {
    if (!unifiedData) {
      return []
    }
    return Object.values(unifiedData).flat()
  }, [unifiedData])

  const notReadyTables = useMemo(() => (
    flatUnifiedData.filter((ud) => ud.maxRow && !ud.cells)
  ), [flatUnifiedData])

  if (isLoadingUnifiedData) {
    return <Spin spinning />
  }

  if (notReadyTables.length > 0) {
    return (
      <FileDocxViewerWithTables
        notReadyTables={notReadyTables}
      />
    )
  }

  const value = mapUDToSlateData(flatUnifiedData)

  return (
    <Content>
      <Slate value={value} />
    </Content>
  )
}

export {
  FileDocxViewer,
}
