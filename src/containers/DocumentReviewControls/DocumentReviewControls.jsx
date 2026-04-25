
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { startReview } from '@/actions/documentReviewPage'
import { ButtonType, Button } from '@/components/Button'
import { DownloadIcon } from '@/components/Icons/DownloadIcon'
import {
  ALLOW_TO_START_REVIEW_STATES,
  FORBIDDEN_EXTENSIONS_TO_START_REVIEW,
} from '@/constants/document'
import { CompleteReviewButton } from '@/containers/CompleteReviewButton'
import { DownloadMenu } from '@/containers/DownloadMenu'
import { MoreActions } from '@/containers/MoreActions'
import { ValidationResults } from '@/containers/ValidationResults'
import { localize, Localization } from '@/localization/i18n'
import { Document, documentShape } from '@/models/Document'
import { documentTypeShape } from '@/models/DocumentType'
import { documentSelector, documentTypeSelector } from '@/selectors/documentReviewPage'
import {
  isDocumentDataFetchingSelector,
  isReviewCompletingSelector,
  isReviewStartingSelector,
  isPipelineRunningSelector,
  isDocumentTypeUpdatingSelector,
  isExtractedDataFieldSavingSelector,
} from '@/selectors/requests'
import { notifyRequest } from '@/utils/notification'
import { Controls } from './DocumentReviewControls.styles'

const START_REVIEW_BUTTON_ID = 'startReview'

class DocumentReviewControls extends Component {
  static propTypes = {
    document: documentShape.isRequired,
    documentType: documentTypeShape.isRequired,
    fetching: PropTypes.bool,
    startReview: PropTypes.func,
  }

  static defaultProps = {
    id: '',
  }

  startReview = async () => {
    await notifyRequest(this.props.startReview())({
      fetching: localize(Localization.FETCHING_START_REVIEW_DOCUMENT),
      warning: localize(Localization.START_REVIEW_FAILED),
      success: localize(Localization.START_REVIEW_SUCCESSFUL),
    })
  }

  startReviewButtonRender = () => (
    <Button
      disabled={this.props.fetching}
      id={START_REVIEW_BUTTON_ID}
      onClick={this.startReview}
      type={ButtonType.PRIMARY}
    >
      {localize(Localization.START_REVIEW)}
    </Button>
  )

  render () {
    const { document } = this.props
    const isForbiddenToReviewExtension = (
      FORBIDDEN_EXTENSIONS_TO_START_REVIEW
        .some((extension) => Document.checkExtension(document, extension))
    )
    const isStateAllowedForReview = ALLOW_TO_START_REVIEW_STATES.includes(document.state)
    const startReviewAllowed = (
      isStateAllowedForReview &&
      !isForbiddenToReviewExtension
    )

    const shouldRenderValidationResults = !!this.props.documentType?.fields?.filter((f) => (
      document.validation?.detail.find(
        (field) => field.fieldCode === f.code,
      )
    )).length

    return (
      <Controls>
        {
          shouldRenderValidationResults &&
            <ValidationResults />
        }
        <DownloadMenu
          containerType={document.containerType}
          documentId={document._id}
          documentTitle={document.title}
          documentType={this.props.documentType}
          error={document.error}
          files={document.files}
          icon={<DownloadIcon />}
          state={document.state}
        />
        {startReviewAllowed && this.startReviewButtonRender()}
        <CompleteReviewButton />
        <MoreActions />
      </Controls>
    )
  }
}

const mapStateToProps = (state) => ({
  document: documentSelector(state),
  documentType: documentTypeSelector(state),
  fetching: (
    isDocumentDataFetchingSelector(state) ||
    isReviewCompletingSelector(state) ||
    isReviewStartingSelector(state) ||
    isPipelineRunningSelector(state) ||
    isDocumentTypeUpdatingSelector(state) ||
    isExtractedDataFieldSavingSelector(state)
  ),
})

const mergeProps = ({ document, ...otherStateProps }, { dispatch }, ownProps) => ({
  document,
  ...ownProps,
  ...otherStateProps,
  startReview: () => dispatch(startReview(document._id)),
})

export const ConnectedComponent = connect(mapStateToProps, null, mergeProps)(DocumentReviewControls)

export {
  ConnectedComponent as DocumentReviewControls,
}
