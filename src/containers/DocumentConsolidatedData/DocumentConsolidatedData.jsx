import {
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePolling } from 'use-raf-polling'
import {
  getDocumentExtractedData,
  getDocumentState,
  fetchDocumentValidation,
} from '@/actions/documentReviewPage'
import { useFetchSupplementsQuery } from '@/apiRTK/documentSupplementsApi'
import { NoData } from '@/components/NoData'
import { Spin } from '@/components/Spin'
import { AddDocumentSupplementButton } from '@/containers/AddDocumentSupplementButton'
import { ConfidenceLevelDropdown } from '@/containers/ConfidenceLevelDropdown'
import { FieldTypeFilterDropdown } from '@/containers/FieldTypeFilterDropdown'
import { DocumentState } from '@/enums/DocumentState'
import {
  useEventSource,
  KnownBusinessEvent,
} from '@/hooks/useEventSource'
import { Localization, localize } from '@/localization/i18n'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { documentSelector, documentTypeSelector } from '@/selectors/documentReviewPage'
import {
  isDocumentDataFetchingSelector,
  isDocumentTypeFetchingSelector,
} from '@/selectors/requests'
import { ENV } from '@/utils/env'
import { Wrapper, Controls } from './DocumentConsolidatedData.styles'
import { DocumentConsolidatedDataFields } from './DocumentConsolidatedDataFields'

const SHOULD_REFETCH_DOCUMENT_STATES = [
  DocumentState.IDENTIFICATION,
  DocumentState.VERSION_IDENTIFICATION,
  DocumentState.DATA_EXTRACTION,
]

const POLLING_INTERVAL = 2_000

const DocumentConsolidatedData = () => {
  const dispatch = useDispatch()

  const document = useSelector(documentSelector)
  const documentType = useSelector(documentTypeSelector)
  const isDocumentDataFetching = useSelector(isDocumentDataFetchingSelector)
  const isDocumentTypeFetching = useSelector(isDocumentTypeFetchingSelector)

  const {
    isLoading: areDocumentSupplementsLoading,
    isFetching: areDocumentSupplementsFetching,
    data: documentSupplements = [],
  } = useFetchSupplementsQuery(document._id, {
    refetchOnMountOrArgChange: true,
  })

  const isDataLoading = (
    isDocumentDataFetching ||
    isDocumentTypeFetching ||
    areDocumentSupplementsLoading
  )

  const addEvent = useEventSource('DocumentConsolidatedData')

  const shouldRefetchED = useMemo(() => (
    SHOULD_REFETCH_DOCUMENT_STATES.includes(document.state)
  ), [document.state])

  const pollDocumentState = useCallback(() => (
    dispatch(getDocumentState(document._id))
  ), [dispatch, document._id])

  const getExtractedData = useCallback(() => (
    dispatch(getDocumentExtractedData())
  ), [dispatch])

  const getDocumentValidation = useCallback(() => (
    dispatch(fetchDocumentValidation())
  ), [dispatch])

  usePolling({
    callback: pollDocumentState,
    interval: POLLING_INTERVAL,
    condition: !ENV.FEATURE_SERVER_SENT_EVENTS && shouldRefetchED,
    onPollingSucceed: getExtractedData,
  })

  usePolling({
    callback: pollDocumentState,
    condition: !ENV.FEATURE_SERVER_SENT_EVENTS && document.state === DocumentState.VALIDATION,
    interval: POLLING_INTERVAL,
    onPollingSucceed: getDocumentValidation,
  })

  const onDocumentStateChanged = useCallback(async (eventData) => {
    if (eventData.documentId !== document._id) {
      return
    }

    const newDocState = await dispatch(getDocumentState(document._id))

    if (SHOULD_REFETCH_DOCUMENT_STATES.includes(newDocState)) {
      getExtractedData()
    }
    if (newDocState === DocumentState.VALIDATION) {
      getDocumentValidation()
    }
  }, [
    document._id,
    dispatch,
    getExtractedData,
    getDocumentValidation,
  ])

  useEffect(() => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      return
    }
    addEvent(KnownBusinessEvent.DOCUMENT_STATE_UPDATED, onDocumentStateChanged)
  }, [addEvent, onDocumentStateChanged])

  if (isDataLoading) {
    return (
      <Spin.Centered spinning />
    )
  }

  const showEmptyData = (
    !documentSupplements.length &&
    !documentType.extraFields?.length &&
    !documentType.fields?.length
  )

  const isAddFieldDisabled = (
    documentType.code !== UNKNOWN_DOCUMENT_TYPE.code &&
    document.state !== DocumentState.IN_REVIEW
  )

  return (
    <Wrapper>
      <Spin spinning={areDocumentSupplementsFetching}>
        <Controls>
          {
            ENV.FEATURE_CONFIGURABLE_CONFIDENCE_LEVEL && (
              <ConfidenceLevelDropdown
                disabled={!documentType.fields?.length}
              />
            )
          }
          <FieldTypeFilterDropdown />
          {
            ENV.FEATURE_ENRICHMENT && (
              <AddDocumentSupplementButton
                disabled={isAddFieldDisabled}
                documentId={document._id}
                documentSupplements={documentSupplements}
                documentTypeCode={documentType.code}
              />
            )
          }
        </Controls>
        {
          showEmptyData
            ? <NoData description={localize(Localization.NOTHING_TO_DISPLAY)} />
            : (
              <DocumentConsolidatedDataFields
                documentSupplements={documentSupplements}
              />
            )
        }
      </Spin>
    </Wrapper>
  )
}

export {
  DocumentConsolidatedData,
}
