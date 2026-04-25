
import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { usePolling } from 'use-raf-polling'
import {
  completeReview,
  saveDocument,
  getDocumentState,
  fetchDocumentValidation,
} from '@/actions/documentReviewPage'
import { ButtonType, Button } from '@/components/Button'
import { DocumentState } from '@/enums/DocumentState'
import {
  useEventSource,
  KnownBusinessEvent,
} from '@/hooks/useEventSource'
import { localize, Localization } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { ExtractedData } from '@/models/ExtractedData'
import { documentSelector, idSelector } from '@/selectors/documentReviewPage'
import {
  isReviewCompletingSelector,
  isDocumentValidationSkippingSelector,
} from '@/selectors/requests'
import { ENV } from '@/utils/env'
import {
  notifyRequest,
  notifySuccess,
  notifyWarning,
} from '@/utils/notification'

const POLLING_INTERVAL = 2_000

const CompleteReviewButton = ({
  getDocumentState,
  fetchDocumentValidation,
  fetching,
  completeReview,
  saveDocument,
  document,
}) => {
  const fetchDocValidation = useCallback(
    async () => {
      const docValidation = await fetchDocumentValidation()
      if (!docValidation || docValidation.isValid) {
        return
      }
      notifyWarning(localize(Localization.COMPLETE_REVIEW_IMPOSSIBLE_DUE_TO_ERROR))
    },
    [fetchDocumentValidation],
  )

  const save = useCallback(async () => {
    await notifyRequest(saveDocument())({
      fetching: localize(Localization.FETCHING_SAVE_DOCUMENT),
      success: localize(Localization.SAVE_DOCUMENT_SUCCESSFUL),
      warning: localize(Localization.SAVE_DOCUMENT_FAILED),
    })
  }, [saveDocument])

  const completeDocumentReview = useCallback(async () => {
    ExtractedData.isModified(document.extractedData) && await save()

    try {
      await completeReview()
      notifySuccess(localize(Localization.COMPLETE_REVIEW_DOCUMENT_SUCCESSFUL))
    } catch {
      notifyWarning(localize(Localization.COMPLETE_REVIEW_DOCUMENT_FAILED))
    }
  }, [
    document,
    save,
    completeReview,
  ])

  const addEvent = useEventSource('CompleteReviewButton')

  const onDocumentStateChanged = useCallback(async (eventData) => {
    if (document._id !== eventData.documentId) {
      return
    }

    if (eventData.state === DocumentState.VALIDATION) {
      await getDocumentState()
      await fetchDocValidation()
    }
  }, [document, getDocumentState, fetchDocValidation])

  useEffect(() => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      return
    }
    addEvent(KnownBusinessEvent.DOCUMENT_STATE_UPDATED, onDocumentStateChanged)
  }, [addEvent, onDocumentStateChanged])

  usePolling({
    callback: getDocumentState,
    condition: !ENV.FEATURE_SERVER_SENT_EVENTS && document.state === DocumentState.VALIDATION,
    interval: POLLING_INTERVAL,
    onPollingSucceed: fetchDocValidation,
  })

  const documentInReview = !!document && document.state === DocumentState.IN_REVIEW

  if (!documentInReview) {
    return null
  }

  return (
    <Button
      disabled={fetching}
      onClick={completeDocumentReview}
      type={ButtonType.PRIMARY}
    >
      {localize(Localization.COMPLETE_REVIEW)}
    </Button>
  )
}

CompleteReviewButton.propTypes = {
  document: documentShape,
  completeReview: PropTypes.func.isRequired,
  getDocumentState: PropTypes.func.isRequired,
  fetchDocumentValidation: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  saveDocument: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  document: documentSelector(state),
  documentId: idSelector(state),
  fetching: (
    isReviewCompletingSelector(state) ||
    isDocumentValidationSkippingSelector(state)
  ),
})

const mergeProps = ({ document, documentId, ...otherStateProps }, { dispatch }, ownProps) => ({
  document,
  ...ownProps,
  ...otherStateProps,
  completeReview: () => dispatch(completeReview(documentId)),
  getDocumentState: () => dispatch(getDocumentState(documentId)),
  fetchDocumentValidation: () => dispatch(fetchDocumentValidation()),
  saveDocument: () => dispatch(saveDocument(document)),
})

const ConnectedComponent = connect(mapStateToProps, null, mergeProps)(CompleteReviewButton)

export {
  ConnectedComponent as CompleteReviewButton,
}
