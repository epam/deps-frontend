
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePolling } from 'use-raf-polling'
import { getDocumentState } from '@/actions/documentReviewPage'
import { setDataByProp } from '@/actions/documents'
import { documentsApi } from '@/api/documentsApi'
import { Spin } from '@/components/Spin'
import { DocumentState } from '@/enums/DocumentState'
import { FileExtension } from '@/enums/FileExtension'
import {
  useEventSource,
  KnownBusinessEvent,
} from '@/hooks/useEventSource'
import { localize, Localization } from '@/localization/i18n'
import { Document, documentShape } from '@/models/Document'
import { highlightedFieldShape } from '@/models/HighlightedField'
import { pointShape } from '@/models/Point'
import { isDocumentStateGettingSelector } from '@/selectors/requests'
import { ENV } from '@/utils/env'
import { getFileExtension } from '@/utils/getFileExtension'
import { DocumentDocxViewer } from './DocumentDocxViewer'
import { DocumentImageBasedViewer } from './DocumentImageBasedViewer'
import { DocumentImagePageSwitcher } from './DocumentImagePageSwitcher'
import { Empty } from './DocumentPreview.styles'
import { DocumentTableViewer } from './DocumentTableViewer'

const POLLING_INTERVAL = 2_000

const NOT_READY_TO_BE_VIEWED_STATES = [
  DocumentState.NEW,
  DocumentState.PREPROCESSING,
  DocumentState.UNIFICATION,
]

const DocumentPreview = ({
  fetching,
  onRefreshPage,
  onChangeActiveImagePage,
  onChangeActiveExcelPage,
  highlightedField,
  document,
  activeSourceId,
  activePage,
  activePolygons,
  addActivePolygons,
  clearActivePolygons,
}) => {
  const dispatch = useDispatch()
  const stateFetching = useSelector(isDocumentStateGettingSelector)
  const [isUnifiedDataIsFetching, setIsUnifiedDataIsFetching] = useState(false)

  const previewAvailable = useMemo(() => (
    !!document.unifiedData ||
    !!document.previewDocuments?.[activePage]
  ), [activePage, document.previewDocuments, document.unifiedData])

  const isNotReadyToBeViewed = useMemo(
    () => NOT_READY_TO_BE_VIEWED_STATES.includes(document.state),
    [document.state],
  )

  const getLatestDocumentState = useCallback(
    () => !stateFetching && dispatch(getDocumentState(document._id)),
    [
      dispatch,
      stateFetching,
      document._id,
    ],
  )

  const getUnifiedData = useCallback(async () => {
    setIsUnifiedDataIsFetching(true)
    const data = await documentsApi.getUnifiedData(document._id)

    dispatch(setDataByProp({
      documentId: document._id,
      prop: 'unifiedData',
      data,
    }))

    setIsUnifiedDataIsFetching(false)
  }, [dispatch, document._id])

  const addEvent = useEventSource('DocumentPreview')

  const onDocumentStateChanged = useCallback(async (eventData) => {
    if (document._id !== eventData.documentId) {
      return
    }

    if (isNotReadyToBeViewed) {
      await getLatestDocumentState()
    }

    if (NOT_READY_TO_BE_VIEWED_STATES.includes(eventData.state) || !!document.unifiedData) {
      return
    }

    await getUnifiedData()
  }, [
    document,
    getUnifiedData,
    isNotReadyToBeViewed,
    getLatestDocumentState,
  ])

  useEffect(() => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      return
    }

    addEvent(KnownBusinessEvent.DOCUMENT_STATE_UPDATED, onDocumentStateChanged)
  }, [addEvent, onDocumentStateChanged])

  usePolling({
    callback: getLatestDocumentState,
    condition: !ENV.FEATURE_SERVER_SENT_EVENTS && isNotReadyToBeViewed,
    interval: POLLING_INTERVAL,
    onPollingSucceed: getUnifiedData,
  })

  const renderPageSwitcher = useCallback((onChangeActivePage) => (
    <DocumentImagePageSwitcher
      activePage={activePage}
      disabled={!previewAvailable}
      onChangeActivePage={onChangeActivePage}
      pagesQuantity={Document.getPagesQuantity(document)}
    />
  ), [activePage, document, previewAvailable])

  if (fetching || isUnifiedDataIsFetching) {
    return <Spin.Centered spinning />
  }

  if (isNotReadyToBeViewed) {
    return (
      <Empty
        description={localize(Localization.PREVIEW_PREPROCESSING)}
      >
        <a
          onClick={onRefreshPage}
        >
          {localize(Localization.REFRESH_THE_PAGE)}
        </a>
      </Empty>
    )
  }

  if (document.state === DocumentState.FAILED && !previewAvailable) {
    return (
      <Empty
        description={localize(Localization.PREVIEW_FAILURE)}
      />
    )
  }

  if (!previewAvailable) {
    return (
      <Empty
        description={localize(Localization.EMPTY_PREVIEW)}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  const [file] = document.files

  const extension = getFileExtension(file.blobName)

  switch (extension) {
    case FileExtension.JPG:
    case FileExtension.JPEG:
    case FileExtension.PNG:
    case FileExtension.TIFF:
    case FileExtension.TIF:
    case FileExtension.PDF:
      return (
        <DocumentImageBasedViewer
          activePage={activePage}
          activePolygons={activePolygons}
          activeSourceId={activeSourceId}
          addActivePolygons={addActivePolygons}
          clearActivePolygons={clearActivePolygons}
          document={document}
          highlightedField={highlightedField}
          onChangeActiveImagePage={onChangeActiveImagePage}
          previewAvailable={previewAvailable}
        />
      )
    case FileExtension.DOCX:
      return (
        <DocumentDocxViewer />
      )
    case FileExtension.XLSX:
    case FileExtension.XLSM:
    case FileExtension.XLTX:
    case FileExtension.XLTM:
    case FileExtension.XLS:
    case FileExtension.CSV:
      return (
        <DocumentTableViewer
          activePage={activePage}
          activeSourceId={activeSourceId}
          document={document}
          highlightedField={highlightedField}
          renderPageSwitcher={() => renderPageSwitcher(onChangeActiveExcelPage)}
        />
      )
    default:
      return (
        <Empty
          description={localize(Localization.UNSUPPORTED_EXTENSION, { fileExtension: extension })}
        />
      )
  }
}

DocumentPreview.propTypes = {
  activePage: PropTypes.number,
  activePolygons: PropTypes.arrayOf(
    PropTypes.arrayOf(pointShape),
  ),
  activeSourceId: PropTypes.string,
  addActivePolygons: PropTypes.func.isRequired,
  clearActivePolygons: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  onChangeActiveImagePage: PropTypes.func.isRequired,
  onChangeActiveExcelPage: PropTypes.func,
  onRefreshPage: PropTypes.func,
  highlightedField: highlightedFieldShape,
  document: documentShape.isRequired,
}

export {
  DocumentPreview,
}
