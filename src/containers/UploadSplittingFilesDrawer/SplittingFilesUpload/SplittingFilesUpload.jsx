
import PropTypes from 'prop-types'
import { useWatch } from 'react-hook-form'
import { ButtonType } from '@/components/Button'
import { PICKER_TYPES } from '@/components/FilesPicker'
import { PlusFilledIcon } from '@/components/Icons/PlusFilledIcon'
import { SUPPORTED_EXTENSIONS_DOCUMENTS, SUPPORTED_TEXT_FORMATS } from '@/constants/common'
import { UnsupportedFilesList } from '@/containers/UnsupportedFilesList'
import { FIELD_FORM_CODE } from '@/containers/UploadSplittingFilesDrawer/constants'
import { FileExtension } from '@/enums/FileExtension'
import { localize, Localization } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { getMime } from '@/utils/getMime'
import {
  notifyWarning,
  notifyError,
} from '@/utils/notification'
import { FileTag } from './FileTag'
import {
  Button,
  UploadIcon,
  FilesPicker,
  AddFilesButton,
  FilesPickerUploadButton,
  ButtonContentBorderlessWrapper,
  FilesWrapper,
  Wrapper,
} from './SplittingFilesUpload.styles'

const BATCH_UNSUPPORTED_EXTENSIONS = [FileExtension.MSG, FileExtension.EML]

const formats = SUPPORTED_EXTENSIONS_DOCUMENTS
  .filter((format) => !BATCH_UNSUPPORTED_EXTENSIONS.includes(format))
  .join(', ')

const SUPPORTED_FORMATS = localize(Localization.SUPPORTED_FORMATS, { formats })

export const SplittingFilesUpload = ({ onChange }) => {
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
    notifyWarning(<UnsupportedFilesList files={unsupportedFiles} />)

    if (unsupportedFiles.length === fileList.length) {
      showNoValidFilesFound()
    }
  }

  const addPickedFiles = (supportedFiles) => {
    const prevFiles = pickedFiles || []

    onChange([...prevFiles, ...supportedFiles])
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
              disabled={false}
              getMime={getMimeType}
              maxFileSize={ENV.MAX_FILE_SIZE_MB}
              onFileSizeValidationFailed={showUnsupportedSizeMessage}
              onFilesSelected={addPickedFiles}
              onFilesValidationFailed={onFilesValidationFailed}
              renderUploadTrigger={renderTrigger}
            />
            <FilesWrapper>
              {
                pickedFiles.map((file) => (
                  <FileTag
                    key={file.uid}
                    file={file}
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
            description={SUPPORTED_FORMATS}
            disabled={false}
            getMime={getMimeType}
            maxFileSize={ENV.MAX_FILE_SIZE_MB}
            onFileSizeValidationFailed={showUnsupportedSizeMessage}
            onFilesSelected={addPickedFiles}
            onFilesValidationFailed={onFilesValidationFailed}
            text={localize(Localization.UPLOAD_TEMPLATES_DRAG_TEXT)}
            type={PICKER_TYPES.DRAGGER}
          >
            <Button
              icon={<UploadIcon />}
              type={ButtonType.DEFAULT}
            >
              {localize(Localization.ADD_FILES)}
            </Button>
          </FilesPicker>
        )
      }
    </>
  )
}

SplittingFilesUpload.propTypes = {
  onChange: PropTypes.func.isRequired,
}
