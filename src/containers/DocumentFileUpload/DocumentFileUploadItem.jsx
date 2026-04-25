
import get from 'lodash/get'
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { Avatar } from '@/components/Avatar'
import { BanIcon } from '@/components/Icons/BanIcon'
import { CheckIcon } from '@/components/Icons/CheckIcon'
import { FileDOCXIcon } from '@/components/Icons/FileDOCXIcon'
import { FileImageIcon } from '@/components/Icons/FileImageIcon'
import { FileJPGIcon } from '@/components/Icons/FileJPGIcon'
import { FileMailIcon } from '@/components/Icons/FileMailIcon'
import { FilePDFIcon } from '@/components/Icons/FilePDFIcon'
import { FileXLSXIcon } from '@/components/Icons/FileXLSXIcon'
import { Progress } from '@/components/Progress'
import { ComponentSize } from '@/enums/ComponentSize'
import { MimeType } from '@/enums/MimeType'
import { UploadStatus } from '@/enums/UploadStatus'
import { localize, Localization } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import { getFileSizeStr } from '@/utils/file'
import {
  ListItem,
  ListMeta,
  ListContent,
  FileIcon,
  LinkButton,
} from './DocumentFileUploadItem.styles'

const setIconStyles = (icon) => (
  <FileIcon>
    {icon}
  </FileIcon>
)

const MIME_TO_ICON = {
  [MimeType.IMAGE_JPEG]: setIconStyles(<FileJPGIcon />),
  [MimeType.APPLICATION_PDF]: setIconStyles(<FilePDFIcon />),
  [MimeType.MAIL_EML]: setIconStyles(<FileMailIcon />),
  [MimeType.MAIL_MSG]: setIconStyles(<FileMailIcon />),
  [MimeType.APPLICATION_DOCX]: setIconStyles(<FileDOCXIcon />),
  [MimeType.APPLICATION_XLSX]: setIconStyles(<FileXLSXIcon />),
}

class DocumentFileUploadItem extends PureComponent {
  static propTypes = {
    file: PropTypes.shape({
      uid: PropTypes.string,
      mime: PropTypes.string,
      type: PropTypes.string,
      name: PropTypes.string,
      size: PropTypes.number,
    }).isRequired,
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

  getFilePercent = () => {
    const percent = get(this.props.documentUploadState, `files[${this.props.file.uid}]`, 0)
    return Math.floor(percent)
  }

  onRemoveClick = () => this.props.deleteFile(this.props.document, this.props.file)

  renderFileActions = () => [
    <LinkButton
      key="remove"
      disabled={this.props.uploading}
      onClick={this.onRemoveClick}
    >
      {localize(Localization.REMOVE)}
    </LinkButton>,
  ]

  shouldRenderFileActions = () => !this.props.documentUploadState.status

  getIcon = () => (
    MIME_TO_ICON[this.props.file.mime ?? this.props.file.type]
      ? MIME_TO_ICON[this.props.file.mime ?? this.props.file.type]
      : setIconStyles(<FileImageIcon />)
  )

  renderIcon = () => (
    <Avatar size={ComponentSize.LARGE}>
      {this.getIcon()}
    </Avatar>
  )

  renderPageTitle = () => <span title={this.props.file.name}>{this.props.file.name}</span>

  renderSuccessStatus = () => (
    <CheckIcon color={theme.color.success} />
  )

  renderFailedStatus = () => (
    <BanIcon color={theme.color.errorDark} />
  )

  renderItemExtra = () => {
    switch (this.props.documentUploadState.status) {
      case UploadStatus.PENDING:
        return <Progress percent={this.getFilePercent()} />
      case UploadStatus.SUCCESS:
        return this.renderSuccessStatus()
      case UploadStatus.FAILURE:
        return this.renderFailedStatus()
      default:
        return null
    }
  }

  render = () => (
    <ListItem
      actions={this.shouldRenderFileActions() && this.renderFileActions()}
    >
      <ListMeta
        avatar={this.renderIcon()}
        description={getFileSizeStr(this.props.file.size)}
        title={this.renderPageTitle()}
      />
      <ListContent>
        {this.renderItemExtra()}
      </ListContent>
    </ListItem>
  )
}

export {
  DocumentFileUploadItem,
}
