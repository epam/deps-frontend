
import PropTypes from 'prop-types'
import { ButtonType } from '@/components/Button'
import { useLayoutData } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { PipelineStepModal } from '@/containers/PipelineStepModal'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { DocumentState } from '@/enums/DocumentState'
import { FileExtension } from '@/enums/FileExtension'
import { FileStatus } from '@/enums/FileStatus'
import { PipelineStep } from '@/enums/PipelineStep'
import { localize, Localization } from '@/localization/i18n'
import { Document } from '@/models/Document'
import { DocumentLayoutInfo } from '@/models/DocumentParsingInfo'
import { ENV } from '@/utils/env'
import { useLayoutEditAction } from '../hooks'
import { EditLink, ParsingTypeOptionContainer } from './ParsingTypeOption.styles'

const AVAILABLE_STATES_TO_OPERATE = [
  DocumentState.IN_REVIEW,
  DocumentState.COMPLETED,
]

const AVAILABLE_FILE_STATES_TO_OPERATE = [
  FileStatus.COMPLETED,
]

export const ParsingTypeOption = ({
  option,
  closeDropdown,
  rawParsingInfoData,
  setSelectedParsingType,
}) => {
  const {
    layoutId,
    isFile,
    document,
    file,
  } = useLayoutData()

  const { handleEditAction } = useLayoutEditAction(rawParsingInfoData)

  const isUserDefinedParsingType = option.value === DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED

  const isDocumentInAvailableStates = document?.state && AVAILABLE_STATES_TO_OPERATE.includes(document.state)
  const isFileInAvailableStates = file?.state?.status && AVAILABLE_FILE_STATES_TO_OPERATE.includes(file.state.status)
  const isInAvailableStates = isFile ? isFileInAvailableStates : isDocumentInAvailableStates

  const alreadyProcessedWithTheOption = (
    rawParsingInfoData?.documentLayoutInfo &&
    DocumentLayoutInfo.getParsingType(rawParsingInfoData.documentLayoutInfo).includes(option.value)
  )

  const isDocx = document ? Document.checkExtension(document, FileExtension.DOCX) : false

  const isCopyAvailable = (
    (isFile ? ENV.FEATURE_FILE_LAYOUT_EDITING : ENV.FEATURE_DOCUMENT_LAYOUT_EDITING) &&
    alreadyProcessedWithTheOption &&
    isInAvailableStates &&
    !isUserDefinedParsingType
  )

  const isStartParsingAvailable = (
    !alreadyProcessedWithTheOption &&
    !isUserDefinedParsingType &&
    !isDocx &&
    isInAvailableStates &&
    !isFile
  )

  const handleCopyForEditing = async () => {
    const done = await handleEditAction(option.value)
    done && setSelectedParsingType(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED)
  }

  return (
    <ParsingTypeOptionContainer>
      <span>{option.text}</span>
      {
        isCopyAvailable && (
          <EditLink
            onClick={handleCopyForEditing}
            type={ButtonType.LINK}
          >
            {localize(Localization.COPY_FOR_EDITING)}
          </EditLink>
        )
      }
      {
        isStartParsingAvailable && document && (
          <PipelineStepModal
            documentId={layoutId}
            documentLLMType={document.llmType}
            documentState={document.state}
            error={document.error}
            modalTitle={localize(Localization.START_PARSING)}
            renderTrigger={
              (open) => (
                <EditLink
                  disabled={isUserDefinedParsingType}
                  onClick={
                    () => {
                      closeDropdown()
                      open()
                    }
                  }
                  type={ButtonType.LINK}
                >
                  {localize(Localization.START_PARSING)}
                </EditLink>
              )
            }
            selectedEngine={option.value}
            step={PipelineStep.PARSING}
          />
        )
      }
    </ParsingTypeOptionContainer>
  )
}

ParsingTypeOption.propTypes = {
  option: PropTypes.shape({
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
  closeDropdown: PropTypes.func.isRequired,
  rawParsingInfoData: PropTypes.shape({
    documentLayoutInfo: PropTypes.shape({
      parsingFeatures: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    }),
  }),
  setSelectedParsingType: PropTypes.func.isRequired,
}
