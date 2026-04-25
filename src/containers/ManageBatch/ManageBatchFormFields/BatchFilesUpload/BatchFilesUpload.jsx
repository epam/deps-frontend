
import PropTypes from 'prop-types'
import { useFormContext, useWatch } from 'react-hook-form'
import { ButtonType } from '@/components/Button'
import { PICKER_TYPES } from '@/components/FilesPicker'
import { PlusFilledIcon } from '@/components/Icons/PlusFilledIcon'
import { SUPPORTED_EXTENSIONS_DOCUMENTS, SUPPORTED_TEXT_FORMATS } from '@/constants/common'
import { FIELD_FORM_CODE } from '@/containers/ManageBatch/constants'
import { PickedFile } from '@/containers/ManageBatch/PickedFile'
import { UnsupportedFilesList } from '@/containers/UnsupportedFilesList'
import { FileExtension } from '@/enums/FileExtension'
import { localize, Localization } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { getMime } from '@/utils/getMime'
import {
  notifyWarning,
  notifyError,
} from '@/utils/notification'
import {
  Button,
  UploadIcon,
  FilesPicker,
  AddFilesButton,
  FilesPickerUploadButton,
  ButtonContentBorderlessWrapper,
  FilesWrapper,
  Wrapper,
} from './BatchFilesUpload.styles'
import { FileCard } from './FileCard'

const MAX_COUNT = 50

const BATCH_UNSUPPORTED_EXTENSIONS = [FileExtension.MSG, FileExtension.EML]

const formats = SUPPORTED_EXTENSIONS_DOCUMENTS
  .filter((format) => !BATCH_UNSUPPORTED_EXTENSIONS.includes(format))
  .join(', ')

const SUPPORTED_FORMATS = localize(Localization.SUPPORTED_FORMATS, { formats })

const TEST_ID = {
  FILES_PICKER: 'files-picker',
  ADD_FILES_BUTTON: 'add-files-button',
  FILES_WRAPPER: 'files-wrapper',
  UPLOAD_BUTTON: 'upload-button',
}

export const BatchFilesUpload = ({ onChange }) => {
  const { getValues } = useFormContext()

  const pickedFiles = useWatch({ name: FIELD_FORM_CODE.FILES })

  const getMimeType = async (file) => {
    if (SUPPORTED_TEXT_FORMATS.includes(file.type)) {
      return file.type
    }
    return await getMime(file)
  }

  const showUnsupportedSizeMessage = () => notifyWarning(localize(Localization.FILE_SIZE_IS_TOO_LARGE))

  const showNoValidFilesFound = () => notifyError(localize(Localization.ONLY_UNSUPPORTED_DOCUMENTS_SELECTED))

  const onFilesValidationFailed = (unsupportedFiles, fileList) => {
    if (fileList.length > MAX_COUNT) {
      notifyWarning(localize(Localization.TOO_MANY_FILES_SELECTED, { maxCount: MAX_COUNT }))
      return
    }

    notifyWarning(<UnsupportedFilesList files={unsupportedFiles} />)

    if (unsupportedFiles.length === fileList.length) {
      showNoValidFilesFound()
    }
  }

  const addPickedFiles = (supportedFiles) => {
    const settings = getValues()
    const files = supportedFiles.map((file) => (
      new PickedFile(
        file,
        {
          engine: settings.engine,
          documentType: settings.documentType,
          llmType: settings.llmType,
          parsingFeatures: settings.parsingFeatures,
        },
      )
    ))
    const prevFiles = pickedFiles || []
    onChange([...prevFiles, ...files])
  }

  const hasPickedFiles = !!pickedFiles?.length

  const renderTrigger = () => (
    <FilesPickerUploadButton
      title={
        localize(
          Localization.SUPPORTED_FORMATS, {
            formats: SUPPORTED_EXTENSIONS_DOCUMENTS.join(', '),
          },
        )
      }
      type={ButtonType.GHOST}
    >
      <ButtonContentBorderlessWrapper>
        <PlusFilledIcon />
        {localize(Localization.ADD_FILES)}
      </ButtonContentBorderlessWrapper>
    </FilesPickerUploadButton>
  )

  return (
    <>
      {
        hasPickedFiles && (
          <Wrapper>
            <AddFilesButton
              $hasPickedFiles={hasPickedFiles}
              accept={formats}
              data-testid={TEST_ID.ADD_FILES_BUTTON}
              disabled={false}
              getMime={getMimeType}
              maxCount={MAX_COUNT}
              maxFileSize={ENV.MAX_FILE_SIZE_MB}
              onFileSizeValidationFailed={showUnsupportedSizeMessage}
              onFilesSelected={addPickedFiles}
              onFilesValidationFailed={onFilesValidationFailed}
              renderUploadTrigger={renderTrigger}
            />
            <FilesWrapper data-testid={TEST_ID.FILES_WRAPPER}>
              {
                pickedFiles.map((fileData, i) => (
                  <FileCard
                    key={fileData.file.uid}
                    fileData={fileData}
                    index={i}
                  />
                ))
              }
            </FilesWrapper>
          </Wrapper>
        )
      }
      {
        !hasPickedFiles && (
          <FilesPicker
            $hasPickedFiles={hasPickedFiles}
            accept={formats}
            data-testid={TEST_ID.FILES_PICKER}
            description={SUPPORTED_FORMATS}
            disabled={false}
            getMime={getMimeType}
            maxCount={MAX_COUNT}
            maxFileSize={ENV.MAX_FILE_SIZE_MB}
            onFileSizeValidationFailed={showUnsupportedSizeMessage}
            onFilesSelected={addPickedFiles}
            onFilesValidationFailed={onFilesValidationFailed}
            text={localize(Localization.UPLOAD_TEMPLATES_DRAG_TEXT)}
            type={PICKER_TYPES.DRAGGER}
          >
            <Button
              data-testid={TEST_ID.UPLOAD_BUTTON}
              icon={<UploadIcon />}
              type={ButtonType.DEFAULT}
            >
              {localize(Localization.UPLOAD)}
            </Button>
          </FilesPicker>
        )
      }
    </>
  )
}

BatchFilesUpload.propTypes = {
  onChange: PropTypes.func.isRequired,
}
