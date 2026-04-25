
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useFetchParsingInfoQuery } from '@/apiRTK/documentLayoutApi'
import { useFetchFileParsingInfoQuery } from '@/apiRTK/fileLayoutApi'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { documentSelector } from '@/selectors/documentReviewPage'

export const LAYOUT_TYPE = {
  DOCUMENT: 'document',
  FILE: 'file',
}

export const LAYOUT_TYPE_TO_ENTITY_ID_KEY = {
  [LAYOUT_TYPE.FILE]: 'fileId',
  [LAYOUT_TYPE.DOCUMENT]: 'documentId',
}

export const useLayoutData = () => {
  const { documentId, fileId } = useParams()

  const layoutId = fileId ?? documentId

  const document = useSelector(documentSelector)

  const { data: file } = useFetchFileQuery(layoutId, { skip: !fileId })

  const {
    isFetching: isFileFetching,
    error: fileError,
  } = useFetchFileParsingInfoQuery(layoutId, { skip: !fileId })

  const {
    isFetching: isDocumentFetching,
    error: documentError,
  } = useFetchParsingInfoQuery(layoutId, { skip: !documentId })

  return {
    layoutId: fileId ?? documentId,
    layoutType: fileId ? LAYOUT_TYPE.FILE : LAYOUT_TYPE.DOCUMENT,
    isFile: !!fileId,
    document,
    file,
    isParsingDataFetching: isFileFetching || isDocumentFetching,
    isParsingDataError: fileError || documentError,
  }
}
