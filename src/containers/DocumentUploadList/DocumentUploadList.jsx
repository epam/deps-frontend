
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { optionShape } from '@/components/Select'
import { DocumentUploadItem } from '@/containers/DocumentUploadItem'
import { UploadStatus } from '@/enums/UploadStatus'
import { documentToUploadShape } from '@/models/DocumentToUpload'
import { DocumentsTable } from './DocumentUploadList.styles'
import { ExpandButton } from './ExpandButton'

const DOCUMENTS_COUNT_TO_COLLAPSE = 3

class DocumentUploadList extends PureComponent {
  static propTypes = {
    size: PropTypes.string,
    documents: PropTypes.arrayOf(
      documentToUploadShape,
    ).isRequired,
    uploadState: PropTypes.objectOf(
      PropTypes.shape({
        status: PropTypes.string.isRequired,
        files: PropTypes.shape({
          _id: PropTypes.string,
        }).isRequired,
      }).isRequired,
    ).isRequired,
    uploading: PropTypes.bool.isRequired,
    onDocumentsChange: PropTypes.func.isRequired,
    engines: PropTypes.arrayOf(optionShape),
    documentTypes: PropTypes.arrayOf(optionShape).isRequired,
    renderDocumentControls: PropTypes.func,
  }

  state = {
    isListCollapsed: true,
  }

  toggleListView = () => {
    this.setState(({ isListCollapsed }) => ({
      isListCollapsed: !isListCollapsed,
    }))
  }

  getDocumentsToRender = () => {
    if (this.state.isListCollapsed) {
      return this.props.documents.slice(0, DOCUMENTS_COUNT_TO_COLLAPSE)
    }

    return this.props.documents
  }

  deleteDocument = (document) => this.props.onDocumentsChange(this.props.documents.filter((d) => d !== document))

  deleteFile = (fromDocument, file) => {
    if (fromDocument.files.length === 1) {
      this.deleteDocument(fromDocument)
      return
    }
    this.props.onDocumentsChange(
      this.props.documents.map((document) => {
        if (document === fromDocument) {
          document.files = document.files.filter((f) => f !== file)
        }
        return document
      }),
    )
  }

  render = () => (
    !!this.props.documents.length && (
      <DocumentsTable size={this.props.size}>
        {
          this.getDocumentsToRender().map((document) => (
            <DocumentUploadItem
              key={document.uid}
              deleteFile={this.deleteFile}
              document={document}
              documentTypes={this.props.documentTypes}
              documentUploadState={this.props.uploadState[document.uid] || {}}
              engines={this.props.engines}
              renderDocumentControls={this.props.renderDocumentControls}
              size={this.props.size}
              uploadStatus={(this.props.uploadState[document.uid] && this.props.uploadState[document.uid].status) || UploadStatus.PENDING}
              uploading={this.props.uploading}
            />
          ))
        }
        {
          this.props.documents.length > DOCUMENTS_COUNT_TO_COLLAPSE &&
          (
            <ExpandButton
              documentsCount={this.props.documents.length}
              isCollapsed={this.state.isListCollapsed}
              toggleView={this.toggleListView}
            />
          )
        }
      </DocumentsTable>
    )
  )
}

export {
  DocumentUploadList,
}
