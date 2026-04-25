
import { useFetchDocumentLayoutQuery } from '@/apiRTK/documentLayoutApi'
import { useFetchFileLayoutQuery } from '@/apiRTK/fileLayoutApi'
import { useLayoutData } from '../useLayoutData'

export const useFetchLayout = ({
  parsingFeature,
  parsingType,
  batchIndex,
  batchSize,
}) => {
  const { layoutId, isFile } = useLayoutData()

  const documentLayoutQuery = useFetchDocumentLayoutQuery({
    documentId: layoutId,
    features: [parsingFeature],
    parsingType,
    batchIndex,
    batchSize,
  }, {
    skip: isFile,
  })

  const fileLayoutQuery = useFetchFileLayoutQuery({
    fileId: layoutId,
    features: [parsingFeature],
    parsingType,
    batchIndex,
    batchSize,
  }, {
    skip: !isFile,
  })

  const {
    data,
    isFetching,
    isError,
  } = isFile ? fileLayoutQuery : documentLayoutQuery

  return {
    data,
    isFetching,
    isError,
  }
}
