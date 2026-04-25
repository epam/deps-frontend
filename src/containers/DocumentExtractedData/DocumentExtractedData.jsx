import PropTypes from 'prop-types'
import { useMemo, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { usePolling } from 'use-raf-polling'
import {
  getDocumentExtractedData,
  getDocumentState,
  fetchDocumentValidation,
} from '@/actions/documentReviewPage'
import { ExtractedDataTabs } from '@/containers/DocumentExtractedData/ExtractedDataTabs'
import { DocumentState } from '@/enums/DocumentState'
import { useCustomFieldsGrouping } from '@/hooks/useCustomFieldsGrouping'
import {
  useEventSource,
  KnownBusinessEvent,
} from '@/hooks/useEventSource'
import { documentShape } from '@/models/Document'
import { documentSelector } from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'

const SHOULD_REFETCH_DOCUMENT_STATES = [
  DocumentState.IDENTIFICATION,
  DocumentState.VERSION_IDENTIFICATION,
  DocumentState.DATA_EXTRACTION,
]
const POLLING_INTERVAL = 2_000

const DocumentExtractedData = ({
  document,
  getDocumentExtractedData,
  getDocumentState,
  fetchDocumentValidation,
}) => {
  const addEvent = useEventSource('DocumentExtractedData')

  const shouldRefetchED = useMemo(() => (
    SHOULD_REFETCH_DOCUMENT_STATES.includes(document.state)
  ), [document.state])

  const pollDocumentState = useCallback(() => (
    getDocumentState(document._id)
  ), [document._id, getDocumentState])

  usePolling({
    callback: pollDocumentState,
    interval: POLLING_INTERVAL,
    condition: !ENV.FEATURE_SERVER_SENT_EVENTS && shouldRefetchED,
    onPollingSucceed: getDocumentExtractedData,
  })

  usePolling({
    callback: pollDocumentState,
    condition: !ENV.FEATURE_SERVER_SENT_EVENTS && document.state === DocumentState.VALIDATION,
    interval: POLLING_INTERVAL,
    onPollingSucceed: fetchDocumentValidation,
  })

  const onDocumentStateChanged = useCallback(async (eventData) => {
    if (eventData.documentId !== document._id) {
      return
    }

    const newDocState = await getDocumentState(document._id)

    if (SHOULD_REFETCH_DOCUMENT_STATES.includes(newDocState)) {
      getDocumentExtractedData()
    }
    if (newDocState === DocumentState.VALIDATION) {
      fetchDocumentValidation()
    }
  }, [
    document._id,
    getDocumentState,
    getDocumentExtractedData,
    fetchDocumentValidation,
  ])

  useEffect(() => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      return
    }
    addEvent(KnownBusinessEvent.DOCUMENT_STATE_UPDATED, onDocumentStateChanged)
  }, [addEvent, onDocumentStateChanged])

  useCustomFieldsGrouping()

  return (
    <ExtractedDataTabs />
  )
}

DocumentExtractedData.propTypes = {
  document: documentShape,
  getDocumentExtractedData: PropTypes.func.isRequired,
  getDocumentState: PropTypes.func.isRequired,
  fetchDocumentValidation: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  document: documentSelector(state),
})

const mapDispatchToProps = {
  getDocumentExtractedData,
  getDocumentState,
  fetchDocumentValidation,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(DocumentExtractedData)

export {
  ConnectedComponent as DocumentExtractedData,
}
