
import { useEffect } from 'react'
import { useFetchDocumentLayoutQuery, useFetchParsingInfoQuery } from '@/apiRTK/documentLayoutApi'
import { Localization, localize } from '@/localization/i18n'
import { DocumentLayoutInfo } from '@/models/DocumentParsingInfo'
import { notifyWarning } from '@/utils/notification'

const BATCH_SIZE = 1
const INITIAL_BATCH_INDEX = 0

const useFetchDocumentLayout = ({
  layoutId,
  features,
  batchIndex,
  batchSize,
}) => {
  const {
    data: parsingInfo,
    isFetching: isParsingInfoFetching,
    error: parsingInfoError,
  } = useFetchParsingInfoQuery(layoutId)

  const documentLayoutInfo = parsingInfo?.documentLayoutInfo

  const { parsingType } = documentLayoutInfo ? DocumentLayoutInfo.getParsingTypeAndFeatures(documentLayoutInfo) : {}

  const pagesInfo = documentLayoutInfo?.pagesInfo
  const pagesCount = pagesInfo ? pagesInfo[parsingType].pagesCount : 0

  const {
    data: documentLayout,
    isFetching: isDocumentLayoutFetching,
    error: documentLayoutError,
  } = useFetchDocumentLayoutQuery({
    documentId: layoutId,
    features,
    parsingType,
    batchIndex: batchIndex || INITIAL_BATCH_INDEX,
    batchSize: batchSize || BATCH_SIZE,
  }, {
    skip: !parsingType,
  })

  useEffect(() => {
    if (documentLayoutError || parsingInfoError) {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  }, [documentLayoutError, parsingInfoError])

  const [mergedTables] = documentLayoutInfo ? Object.values(documentLayoutInfo.mergedTables) : []

  return {
    isLoading: isParsingInfoFetching || isDocumentLayoutFetching,
    documentLayout,
    parsingType,
    mergedTables,
    pagesCount,
  }
}

export {
  useFetchDocumentLayout,
}
