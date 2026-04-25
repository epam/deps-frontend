
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { List } from '@/components/List'
import { DocumentFileUploadItem } from './DocumentFileUploadItem'

class DocumentFileUploadList extends PureComponent {
  static propTypes = {
    size: PropTypes.string,
    files: PropTypes.arrayOf(PropTypes.shape({
      uid: PropTypes.string,
      mime: PropTypes.string,
      type: PropTypes.string,
      name: PropTypes.string,
      size: PropTypes.number,
    })).isRequired,
    documentUploadState: PropTypes.shape({
      status: PropTypes.string,
      files: PropTypes.shape({
        _id: PropTypes.string,
      }),
    }).isRequired,
    document: PropTypes.shape({
      files: PropTypes.arrayOf(PropTypes.shape({
        uid: PropTypes.string,
        mime: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number,
      })),
      name: PropTypes.string,
      uid: PropTypes.string,
    }).isRequired,
    deleteFile: PropTypes.func.isRequired,
    uploading: PropTypes.bool.isRequired,
  }

  renderFile = (file) => (
    <DocumentFileUploadItem
      deleteFile={this.props.deleteFile}
      document={this.props.document}
      documentUploadState={this.props.documentUploadState}
      file={file}
      uploading={this.props.uploading}
    />
  )

  render = () => (
    <List
      dataSource={this.props.files}
      renderItem={this.renderFile}
      size={this.props.size}
    />
  )
}

export {
  DocumentFileUploadList,
}
