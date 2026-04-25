import Upload from 'antd/es/upload'
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import 'antd/lib/upload/style/index.less'
import isRequiredIf from 'react-proptype-conditional-require'
import { Button, ButtonType } from '@/components/Button'
import { localize, Localization } from '@/localization/i18n'
import { getFileExtension } from '@/utils/getFileExtension'
import { getExtensionsFromMime, getMime } from '@/utils/getMime'
import { convertBytesToMegaBytes } from '@/utils/math'
import { notifyProgress, notifyWarning } from '@/utils/notification'
import { childrenShape } from '@/utils/propTypes'

const PICKER_TYPES = {
  FILE: 'file',
  DIRECTORY: 'directory',
  DRAGGER: 'dragger',
}

const Dragger = Upload.Dragger

class FilesPicker extends PureComponent {
  static propTypes = {
    multiple: PropTypes.bool,
    maxCount: PropTypes.number,
    className: PropTypes.string,
    accept: PropTypes.string,
    type: PropTypes.oneOf(
      Object.values(PICKER_TYPES),
    ),
    iconForDraggerUpload: PropTypes.element,
    icon: PropTypes.element,
    text: PropTypes.string,
    description: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    onFileSelected: PropTypes.func,
    onFilesSelected: PropTypes.func.isRequired,
    children: childrenShape,
    maxFileSize: PropTypes.number,
    onFileSizeValidationFailed: isRequiredIf(PropTypes.func, (props) => !!props.maxFileSize),
    onFilesValidationFailed: PropTypes.func,
    renderUploadTrigger: PropTypes.func,
    getMime: PropTypes.func,
  }

  static defaultProps = {
    multiple: true,
  }

  constructor (props) {
    super(props)
    // Since there is no way to have one callback for all the files at once in antd,
    // we're using this counter to add such functionality.
    // After beforeUpload callback will be called for each file,
    // we will call onFilesSelected with list of the all files.
    this.processedFilesCounter = 0
    this.supportedFiles = []
    this.unsupportedFiles = []
  }

  getMime = this.props.getMime || getMime

  beforeUpload = (file, fileList) => {
    this.closeNotification ||= notifyProgress(localize(Localization.CURRENTLY_ADDING_FILES))
    this.getMime(file).then((mime) => {
      file.mime = mime
      const isFileFormatValid = this.isFormatValid(file)
      const isFileSizeValid = this.isSizeValid(file)
      return isFileFormatValid && isFileSizeValid
    }).then((isSupported) => {
      if (isSupported) {
        this.supportedFiles.push(file)
        this.props.onFileSelected && this.props.onFileSelected(file)
      } else {
        this.unsupportedFiles.push(file.name)
      }
      this.processedFilesCounter++

      if (this.processedFilesCounter === fileList.length) {
        this.unsupportedFiles.length && this.props.onFilesValidationFailed?.(this.unsupportedFiles, fileList)
        this.supportedFiles.length && this.props.onFilesSelected(this.supportedFiles)
        this.unsupportedFiles = []
        this.supportedFiles = []
        this.processedFilesCounter = 0
        this.closeNotification?.()
      }
    })
    return false
  }

  isFormatValid = (file) => {
    const extensions = getExtensionsFromMime(file.mime)
    const nameExtension = getFileExtension(file.name)

    const isExtensionMatching = !!extensions?.some((extension) => extension === nameExtension)

    return isExtensionMatching && (
      !this.props.accept ||
      this.props.accept.includes(file.mime) ||
      this.props.accept.includes(nameExtension)
    )
  }

  isSizeValid = (file) => {
    if (!this.props.maxFileSize) {
      return true
    }

    const fileSizeInMb = convertBytesToMegaBytes(file.size)
    const isFileSizeValid = fileSizeInMb <= this.props.maxFileSize
    !isFileSizeValid && this.props.onFileSizeValidationFailed()
    return isFileSizeValid
  }

  handleDrop = (e) => {
    const fileList = [...e.dataTransfer.files]

    if (!fileList.length) return

    fileList.forEach((file) => {
      this.getMime(file).then((mime) => {
        file.mime = mime
        const isFormatValid = this.isFormatValid(file)

        if (!isFormatValid) {
          notifyWarning(
            localize(Localization.FILE_UNSUPPORTED_FORMAT, { fileName: file.name }),
          )
        }
      })
    })
  }

  renderDefaultUploadTrigger = () => (
    <Button
      disabled={this.props.disabled}
      title={this.props.description}
      type={ButtonType.GHOST}
    >
      {this.props.icon && this.props.icon}
      {this.props.text}
    </Button>
  )

  renderButton = () => {
    const renderTrigger = this.props.renderUploadTrigger || this.renderDefaultUploadTrigger

    return (
      <div
        onDrop={this.handleDrop}
      >
        <Upload
          accept={this.props.accept}
          beforeUpload={this.beforeUpload}
          className={this.props.className}
          directory={this.props.type === PICKER_TYPES.DIRECTORY}
          maxCount={this.props.maxCount}
          multiple={this.props.multiple}
          showUploadList={false}
        >
          {renderTrigger()}
        </Upload>
      </div>
    )
  }

  renderDragger = () => (
    <Dragger
      accept={this.props.accept}
      beforeUpload={this.beforeUpload}
      className={this.props.className}
      disabled={this.props.disabled}
      maxCount={this.props.maxCount}
      multiple={this.props.multiple}
      onDrop={this.handleDrop}
      showUploadList={false}
    >
      {this.props.children}
      <p className="ant-upload-drag-icon">
        {this.props.iconForDraggerUpload && this.props.iconForDraggerUpload}
      </p>
      <p className="ant-upload-text">
        {this.props.text}
      </p>
      <p className="ant-upload-hint">
        {this.props.description}
      </p>
    </Dragger>
  )

  render = () => this.props.type === PICKER_TYPES.DRAGGER ? this.renderDragger() : this.renderButton()
}

export {
  FilesPicker,
  PICKER_TYPES,
}
