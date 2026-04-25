
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { clearDocumentStore } from '@/actions/documentReviewPage'
import { fetchDocumentData } from '@/actions/documents'
import { clearDocumentTypeStore } from '@/actions/documentType'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { setUi, goTo } from '@/actions/navigation'
import { Spin } from '@/components/Spin'
import { UiKeys } from '@/constants/navigation'
import { ContainerType } from '@/enums/ContainerType'
import { StatusCode } from '@/enums/StatusCode'
import { Document, documentShape } from '@/models/Document'
import { DocumentReview } from '@/pages/DocumentReview'
import { EmailReviewPage } from '@/pages/EmailReviewPage'
import { documentSelector } from '@/selectors/documentReviewPage'
import { uiSelector } from '@/selectors/navigation'
import { OCRGridCache } from '@/services/OCRExtractionService'
import { navigationMap } from '@/utils/navigationMap'
import { goBack } from '@/utils/routerActions'

const StatusCodeToRedirectUrl = {
  [StatusCode.FORBIDDEN]: navigationMap.error.permissionDenied(),
  [StatusCode.NOT_FOUND]: navigationMap.error.notFound(),
}

class DocumentReviewPage extends PureComponent {
  static propTypes = {
    goTo: PropTypes.func.isRequired,
    setUi: PropTypes.func,
    activePage: PropTypes.number.isRequired,
    fetchDocumentTypes: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        documentId: PropTypes.string,
      }),
    }),
    fetchDocumentData: PropTypes.func,
    clearDocumentStore: PropTypes.func,
    clearDocumentTypeStore: PropTypes.func,
    document: documentShape,
  }

  fetchDocumentData = async () => {
    const {
      fetchDocumentData,
      match,
    } = this.props

    const documentId = this.getDocumentId(match)
    try {
      await fetchDocumentData(documentId)
    } catch (error) {
      StatusCodeToRedirectUrl[error.response?.status] && this.props.goTo(StatusCodeToRedirectUrl[error.response.status])
    }
  }

  componentDidMount () {
    if (!this.getDocumentId(this.props.match)) {
      console.info('Redirect to store because you didn`t select document for view') // eslint-disable-line no-console
      goBack()
      return
    }
    this.props.fetchDocumentTypes()
    this.fetchDocumentData()
  }

  getDocumentId = (match) => match.params.documentId

  componentDidUpdate = (prevProps) => {
    const currentDocumentId = this.getDocumentId(this.props.match)
    const prevDocumentId = this.getDocumentId(prevProps.match)
    if (prevDocumentId !== currentDocumentId) {
      this.fetchDocumentData()
    }
  }

  componentWillUnmount () {
    this.props.clearDocumentStore()
    this.props.clearDocumentTypeStore()
    OCRGridCache.clear()
  }

  render = () => {
    if (!this.props.document) {
      return <Spin.Centered spinning />
    }

    if (!this.props.document.containerType) {
      return (
        <DocumentReview
          activePage={this.props.activePage}
          pagesQuantity={Document.getPagesQuantity(this.props.document)}
          setUi={this.props.setUi}
        />
      )
    }

    if (this.props.document.containerType === ContainerType.EMAIL) {
      return <EmailReviewPage />
    }
  }
}

const mapStateToProps = (state) => ({
  activePage: uiSelector(state)[UiKeys.ACTIVE_PAGE] || 1,
  document: documentSelector(state),
})

const ConnectedComponent = withRouter(connect(mapStateToProps, {
  fetchDocumentData,
  fetchDocumentTypes,
  clearDocumentStore,
  clearDocumentTypeStore,
  goTo,
  setUi,
})(DocumentReviewPage))

export {
  ConnectedComponent as DocumentReviewPage,
}
