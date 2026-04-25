
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { updateDocumentType } from '@/actions/documentReviewPage'
import { Button } from '@/components/Button'
import { Dropdown } from '@/components/Dropdown'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { FeatureControl } from '@/components/FeatureControl'
import { EllipsisVerticalIcon } from '@/components/Icons/EllipsisVerticalIcon'
import { ADD_LABEL_BUTTON } from '@/constants/automation'
import {
  ALLOW_STATE_TO_SKIP_VALIDATION,
  ALLOW_STATE_TO_CHANGE_DOCUMENT_TYPE,
  DELETE,
  CHANGE_DOCUMENT_TYPE,
  SKIP_VALIDATION,
  CHANGE_DOCUMENT_LANGUAGE,
  FORBIDDEN_EXTENSIONS_TO_OPEN_LT,
  FORBIDDEN_EXTENSIONS_TO_LAUNCH_PIPELINE,
  RUN_PIPELINE_FROM_STEP,
  FORBIDDEN_EXTENSIONS_FOR_OUTPUT_ACTIONS,
} from '@/constants/document'
import { AddCommentsButton } from '@/containers/AddCommentsButton'
import { AgenticChatModalButton } from '@/containers/AgenticChatModalButton'
import { ChangeDocumentLanguageButton } from '@/containers/ChangeDocumentLanguageButton'
import { ChangeDocumentTypeButton } from '@/containers/ChangeDocumentTypeButton'
import { DeleteDocumentButton } from '@/containers/DeleteDocumentButton'
import { DetectTableDataButton } from '@/containers/DetectTableDataButton'
import { DocumentInformationButton } from '@/containers/DocumentInformationButton'
import { DocumentOutputArchiveButton } from '@/containers/DocumentOutputArchiveButton'
import { StudioTriggerButton } from '@/containers/DocumentPromptCalibrationStudio'
import { GoToErrorButton } from '@/containers/GoToErrorButton'
import { ManageLabelsModalButton } from '@/containers/ManageLabelsModalButton'
import { OpenLabelingToolButton } from '@/containers/OpenLabelingToolButton'
import { PdfSplittingButton } from '@/containers/PdfSplitting'
import { RunPipelineButton } from '@/containers/RunPipelineButton'
import { SkipValidationButton } from '@/containers/SkipValidationButton'
import { DocumentState } from '@/enums/DocumentState'
import { FeatureNames } from '@/enums/FeatureNames'
import { localize, Localization } from '@/localization/i18n'
import { Document, documentShape } from '@/models/Document'
import { documentTypeShape, UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import {
  idSelector,
  documentSelector,
  documentTypeSelector,
} from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'
import { isFeatureEnabled } from '@/utils/features'
import { getFileExtension } from '@/utils/getFileExtension'
import { notifyRequest } from '@/utils/notification'
import { StyledMenu, LocalBoundary } from './MoreActions.styles'

const { SubMenu } = StyledMenu

const getManageLabelsTrigger = (onCLick) => (
  <Button.Text
    data-automation={ADD_LABEL_BUTTON}
    onClick={onCLick}
  >
    {localize(Localization.MANAGE_LABELS)}
  </Button.Text>
)

class MoreActions extends Component {
  static propTypes = {
    documentId: PropTypes.string.isRequired,
    updateDocumentType: PropTypes.func,
    document: documentShape.isRequired,
    documentType: documentTypeShape.isRequired,
  }

  isViewOutputArchiveAllowed = () => (
    ENV.FEATURE_OUTPUT_PROFILES &&
    FORBIDDEN_EXTENSIONS_FOR_OUTPUT_ACTIONS
      .every((extension) => !Document.checkExtension(this.props.document, extension))
  )

  isUnknownDocumentType = () => (
    this.props.documentType === UNKNOWN_DOCUMENT_TYPE
  )

  isRunPipelineDisabled = () => (
    FORBIDDEN_EXTENSIONS_TO_LAUNCH_PIPELINE
      .some((extension) => Document.checkExtension(this.props.document, extension))
  )

  renderLocalBoundary = () => (
    <LocalBoundary>
      {
        localize(Localization.DEFAULT_ERROR_MESSAGE)
      }
    </LocalBoundary>
  )

  renderMenuOptions = (key, children) => (
    <ErrorBoundary
      localBoundary={this.renderLocalBoundary}
    >
      <StyledMenu.Item
        key={key}
        eventKey={key}
        id={key}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {children}
      </StyledMenu.Item>
    </ErrorBoundary>

  )

  renderDeleteDocument = () => this.renderMenuOptions(
    DELETE,
    <DeleteDocumentButton
      documentId={this.props.documentId}
    >
      {localize(Localization.DELETE_DOCUMENT)}
    </DeleteDocumentButton>,
  )

  renderGoToError = () => this.renderMenuOptions(
    localize(Localization.GO_TO_ERROR),
    <GoToErrorButton>
      {localize(Localization.GO_TO_ERROR)}
    </GoToErrorButton>,
  )

  renderRunPipeline = () => (
    <ErrorBoundary
      localBoundary={this.renderLocalBoundary}
    >
      <SubMenu
        key={RUN_PIPELINE_FROM_STEP}
        disabled={this.isRunPipelineDisabled()}
        eventKey={RUN_PIPELINE_FROM_STEP}
        title={localize(Localization.LAUNCH_PIPELINE)}
      >
        <RunPipelineButton
          documentEngine={this.props.document.engine}
          documentId={this.props.documentId}
          documentLLMType={this.props.document.llmType}
          documentState={this.props.document.state}
          error={this.props.document.error}
        />
      </SubMenu>
    </ErrorBoundary>
  )

  isSkipValidationDisabled = () => (
    !ALLOW_STATE_TO_SKIP_VALIDATION.includes(this.props.document.state) ||
    this.isUnknownDocumentType()
  )

  renderSkipValidation = () => this.renderMenuOptions(
    SKIP_VALIDATION,
    <SkipValidationButton
      disabled={this.isSkipValidationDisabled()}
      documentId={this.props.documentId}
      extractedData={this.props.document.extractedData}
    >
      {localize(Localization.SKIP_VALIDATION)}
    </SkipValidationButton>,
  )

  updateDocumentType = async (type) => {
    await notifyRequest(this.props.updateDocumentType(type))({
      fetching: localize(Localization.FETCHING_UPDATE_DOCUMENT_TYPE),
      warning: localize(Localization.UPDATE_DOCUMENT_TYPE_FAILED),
      success: localize(Localization.UPDATE_DOCUMENT_TYPE_SUCCESSFUL),
    })
  }

  renderChangeDocumentType = () => this.renderMenuOptions(
    CHANGE_DOCUMENT_TYPE,
    <ChangeDocumentTypeButton
      disabled={!ALLOW_STATE_TO_CHANGE_DOCUMENT_TYPE.includes(this.props.document.state)}
      documentType={this.props.document.documentType}
      groupId={this.props.document.groupId}
      updateDocumentType={this.updateDocumentType}
    >
      {localize(Localization.CHANGE_DOCUMENT_TYPE)}
    </ChangeDocumentTypeButton>,
  )

  renderChangeDocumentLanguage = () => this.renderMenuOptions(
    CHANGE_DOCUMENT_LANGUAGE,
    <FeatureControl featureName={FeatureNames.SHOW_NOT_IMPLEMENTED}>
      <ChangeDocumentLanguageButton>
        {localize(Localization.CHANGE_DOCUMENT_LANGUAGE)}
      </ChangeDocumentLanguageButton>
    </FeatureControl>,
  )

  renderDetectTableData = () => {
    const { document } = this.props

    if (!document.documentType) {
      return null
    }

    return (
      <FeatureControl
        featureName={FeatureNames.SHOW_NOT_IMPLEMENTED}
      >
        {
          this.renderMenuOptions(
            localize(Localization.DETECT_TABLE),

            <DetectTableDataButton
              disabled
            >
              {localize(Localization.DETECT_TABLE)}
            </DetectTableDataButton>,
          )
        }
      </FeatureControl>
    )
  }

  renderAddComments = () => this.renderMenuOptions(
    localize(Localization.ADD_COMMENT_ACTION),
    <AddCommentsButton />,
  )

  renderDocumentInformation = () => this.renderMenuOptions(
    localize(Localization.DOCUMENT_INFORMATION),
    <DocumentInformationButton />,
  )

  renderOutputArchiveButton = () => this.renderMenuOptions(
    localize(Localization.OUTPUT_ARCHIVE),
    <DocumentOutputArchiveButton />,
  )

  renderSplitDocumentButton = () => this.renderMenuOptions(
    localize(Localization.SPLIT_DOCUMENT),
    <PdfSplittingButton />,
  )

  isLTButtonDisabled = () => {
    const extension = getFileExtension(this.props.document.files[0].blobName)

    return (
      this.props.document.state !== DocumentState.IN_REVIEW ||
      !this.props.documentType.fields.length ||
      FORBIDDEN_EXTENSIONS_TO_OPEN_LT.includes(extension) ||
      this.isUnknownDocumentType()
    )
  }

  renderOpenLabelingTool = () => {
    const disabled = this.isLTButtonDisabled()

    return this.renderMenuOptions(
      'openLabelingTool',
      (
        <OpenLabelingToolButton
          disabled={disabled}
          document={this.props.document}
          documentId={this.props.documentId}
        >
          {localize(Localization.OPEN_IN_LABELING_TOOL)}
        </OpenLabelingToolButton>
      ),
      disabled,
    )
  }

  renderManageLabelButton = () => this.renderMenuOptions(
    localize(Localization.MANAGE_LABELS),
    <ManageLabelsModalButton
      documentIds={[this.props.documentId]}
      renderTrigger={getManageLabelsTrigger}
    />,
  )

  renderDocumentPromptCalibrationStudioButton = () => this.renderMenuOptions(
    localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO),
    <StudioTriggerButton />,
  )

  renderAgentChat = () => this.renderMenuOptions(
    localize(Localization.DEPS_AGENT_CHAT),
    <AgenticChatModalButton />,
  )

  renderDropDownMenu = () => (
    <StyledMenu>
      {ENV.FEATURE_RUN_PIPELINE && this.renderRunPipeline()}
      {ENV.FEATURE_LABELING_TOOL && this.renderOpenLabelingTool()}
      {ENV.FEATURE_DOCUMENT_DELETE && this.renderDeleteDocument()}
      {ENV.FEATURE_DOCUMENT_CHANGE_TYPE && this.renderChangeDocumentType()}
      {this.renderChangeDocumentLanguage()}
      {this.renderSkipValidation()}
      {this.renderDetectTableData()}
      {isFeatureEnabled(FeatureNames.SHOW_NOT_IMPLEMENTED) && this.renderGoToError()}
      {this.renderAddComments()}
      {this.renderDocumentInformation()}
      {this.isViewOutputArchiveAllowed() && this.renderOutputArchiveButton()}
      {this.renderManageLabelButton()}
      {ENV.FEATURE_PDF_SPLITTING && this.renderSplitDocumentButton()}
      {ENV.FEATURE_PROMPT_CALIBRATION_STUDIO && this.renderDocumentPromptCalibrationStudioButton()}
      {ENV.FEATURE_AGENTIC_DOCUMENT_PROCESSING && this.renderAgentChat()}
    </StyledMenu>
  )

  render = () => (
    <Dropdown dropdownRender={this.renderDropDownMenu}>
      <Button.Secondary
        icon={<EllipsisVerticalIcon />}
      />
    </Dropdown>
  )
}

const mapStateToProps = (state) => ({
  documentId: idSelector(state),
  document: documentSelector(state),
  documentType: documentTypeSelector(state),
})

const mapDispatchToProps = {
  updateDocumentType,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(MoreActions)

export {
  ConnectedComponent as MoreActions,
}
