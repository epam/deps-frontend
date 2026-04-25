
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { Button } from '@/components/Button'
import { ArrowDownSolidIcon } from '@/components/Icons/ArrowDownSolidIcon'
import { CustomMenu } from '@/components/Menu/CustomMenu'
import { Spin } from '@/components/Spin'
import { Tooltip } from '@/components/Tooltip'
import { DOWNLOAD_DOCUMENT_BUTTON } from '@/constants/automation'
import { FORBIDDEN_EXTENSIONS_FOR_OUTPUT_ACTIONS } from '@/constants/document'
import { DownloadDropdownButton } from '@/containers/DownloadDropdownButton'
import { DownloadLink } from '@/containers/DownloadLink'
import { ContainerType } from '@/enums/ContainerType'
import { DocumentState } from '@/enums/DocumentState'
import { FileExtension } from '@/enums/FileExtension'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { documentErrorShape, fileShape } from '@/models/Document'
import { UNKNOWN_DOCUMENT_TYPE, documentTypeShape } from '@/models/DocumentType'
import { apiMap } from '@/utils/apiMap'
import { ENV } from '@/utils/env'
import { getDownloadFileName, removeFileExtension } from '@/utils/file'
import { getFileExtension } from '@/utils/getFileExtension'
import { childrenShape } from '@/utils/propTypes'
import { OutputProfileExportDrawer } from '../OutputProfilesExportDrawer'
import { ExportByProfilePluginsMenu } from './ExportByProfilePluginsMenu'
import { withCustomization } from './withCustomization'

const FORBIDDEN_STATES_TO_DOWNLOAD = [
  DocumentState.NEW,
  DocumentState.UNIFICATION,
  DocumentState.PREPROCESSING,
  DocumentState.VERSION_IDENTIFICATION,
]

const KEY_ORIGINAL_DOCUMENT = 'original'
const KEY_PREPROCESSED_DOCUMENT = 'preprocessed'

class DownloadMenu extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    state: PropTypes.string,
    error: PropTypes.oneOfType([
      documentErrorShape,
    ]),
    files: PropTypes.arrayOf(fileShape),
    documentId: PropTypes.string,
    documentType: documentTypeShape,
    documentTitle: PropTypes.string,
    icon: PropTypes.element,
    isDocumentTypeFetching: PropTypes.bool,
    getPopupContainer: PropTypes.func,
    containerType: PropTypes.string,
    getApiUrl: PropTypes.func,
    children: childrenShape,
  }

  state = {
    isDrawerVisible: false,
  }

  onToggleDrawer = () => this.setState((prev) => ({
    isDrawerVisible: !prev.isDrawerVisible,
  }))

  isRenderDrawerBtnDisabled = () => (
    this.props.documentType?.code === UNKNOWN_DOCUMENT_TYPE.code ||
    !this.props.documentType?.fields.length ||
    FORBIDDEN_EXTENSIONS_FOR_OUTPUT_ACTIONS.includes(this.getFileExtension())
  )

  renderOption = (key, children, disabled, apiUrl, fileName) => (
    <Button.Text disabled={disabled}>
      <DownloadLink
        key={key}
        apiUrl={this.props.getApiUrl?.(key) ?? apiUrl}
        fileName={fileName}
      >
        {children}
      </DownloadLink>
    </Button.Text>
  )

  renderDrawerButton = () => (
    <Spin spinning={this.props.isDocumentTypeFetching}>
      <Button.Text
        disabled={this.isRenderDrawerBtnDisabled()}
        onClick={this.onToggleDrawer}
      >
        {localize(Localization.EXPORT_BY_PROFILE)}
      </Button.Text>
    </Spin>
  )

  isDownloadImagesDisabled = () => (
    FORBIDDEN_STATES_TO_DOWNLOAD.includes(this.props.state) ||
    FORBIDDEN_STATES_TO_DOWNLOAD.includes(this.props.error?.inState) ||
    this.props.containerType === ContainerType.EMAIL
  )

  getFileExtension = () => {
    if (!this.props.files) {
      return ''
    }
    return getFileExtension(this.props.files[0].blobName)
  }

  // TODO: #2703
  renderItems = () => ([
    {
      content: () => (
        this.renderOption(
          KEY_ORIGINAL_DOCUMENT,
          localize(Localization.ORIGINAL_DOCUMENT),
          this.props.disabled,
          apiMap.apiGatewayV2.v5.documents.document.blob(this.props.documentId),
          getDownloadFileName({
            extension: this.getFileExtension(),
            title: this.props.documentTitle,
          }),
        )
      ),
    },
    {
      content: this.renderDrawerButton,
    },
    {
      subContent: <ExportByProfilePluginsMenu documentType={this.props.documentType} />,
    },
    {
      content: () => (
        this.renderOption(
          KEY_PREPROCESSED_DOCUMENT,
          localize(Localization.PREPROCESSED_IMAGES),
          this.isDownloadImagesDisabled(),
          apiMap.apiGatewayV2.v5.documents.document.preprocessedFiles(this.props.documentId),
          getDownloadFileName({
            extension: FileExtension.ZIP,
            title: this.props.documentTitle && removeFileExtension(this.props.documentTitle),
          }),
        )
      ),
      disabled: this.isDownloadImagesDisabled(),
    },
    {
      content: () => (
        <DownloadDropdownButton
          documentId={this.props.documentId}
          documentName={
            getDownloadFileName({
              extension: FileExtension.JSON,
              title: this.props.documentTitle,
            })
          }
          documentTypeCode={this.props.documentType?.code}
        />
      ),
    },
  ])

  renderButtonContent = () => {
    if (this.props.children) {
      return this.props.children
    }

    if (this.props.icon) {
      return (
        <Tooltip title={localize(Localization.DOWNLOAD_DOCUMENT)}>
          <Button.Secondary
            data-automation={DOWNLOAD_DOCUMENT_BUTTON}
            disabled={this.props.disabled}
            icon={<ArrowDownSolidIcon />}
          />
        </Tooltip>
      )
    }

    return (
      <Button>
        {localize(Localization.DOWNLOAD)}
      </Button>
    )
  }

  render = () => (
    <>
      <CustomMenu
        disabled={this.props.disabled}
        getPopupContainer={this.props.getPopupContainer || ((trigger) => trigger.parentNode)}
        items={this.renderItems()}
        placement={Placement.BOTTOM_RIGHT}
      >
        {this.renderButtonContent()}
      </CustomMenu>
      {
        ENV.FEATURE_OUTPUT_PROFILES && (
          <OutputProfileExportDrawer
            documentId={this.props.documentId}
            documentTitle={this.props.documentTitle}
            documentType={this.props.documentType}
            isVisible={this.state.isDrawerVisible}
            onClose={this.onToggleDrawer}
          />
        )
      }
    </>
  )
}

const WrapperComponent = withCustomization(DownloadMenu)

export {
  WrapperComponent as DownloadMenu,
}
