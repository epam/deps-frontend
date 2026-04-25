
import PropTypes from 'prop-types'
import { Button } from '@/components/Button'
import { FilesPicker, PICKER_TYPES } from '@/components/FilesPicker'
import { FaRotateIcon } from '@/components/Icons/FaRotateIcon'
import { FileCodeIcon } from '@/components/Icons/FileCodeIcon'
import { Localization, localize } from '@/localization/i18n'
import { getMime } from '@/utils/getMime'
import { notifyWarning } from '@/utils/notification'
import { SUPPORTED_EXTENSIONS, SUPPORTED_FORMATS } from '../constants'
import {
  ChangeButton,
  Image,
  Title,
  Wrapper,
} from './FileUpload.styles'

const formats = SUPPORTED_EXTENSIONS.join(', ')

const getMimeType = async (file) => {
  if (SUPPORTED_FORMATS.includes(file.type)) {
    return file.type
  }
  return await getMime(file)
}

const FileUpload = ({
  setData,
  value: fileName,
  disabled,
}) => {
  const renderImportTrigger = () => (
    <Button.Secondary>
      {localize(Localization.IMPORT)}
    </Button.Secondary>
  )

  const renderChangeTrigger = () => (
    <ChangeButton
      disabled={disabled}
      icon={<FaRotateIcon />}
    >
      {localize(Localization.CHANGE)}
    </ChangeButton>
  )

  const onFilesSelected = ([file]) => {
    setData(file)
  }

  const onFilesValidationFailed = ([unsupportedFile]) => {
    notifyWarning(localize(Localization.FILE_UNSUPPORTED_FORMAT, { fileName: unsupportedFile }))
  }

  return fileName ? (
    <Wrapper>
      <Image>
        <FileCodeIcon />
      </Image>
      <Title>{fileName}</Title>
      <FilesPicker
        accept={formats}
        disabled={false}
        getMime={getMimeType}
        onFilesSelected={onFilesSelected}
        onFilesValidationFailed={onFilesValidationFailed}
        renderUploadTrigger={renderChangeTrigger}
        type={PICKER_TYPES.FILE}
      />
    </Wrapper>
  ) : (
    <FilesPicker
      accept={formats}
      disabled={false}
      getMime={getMimeType}
      onFilesSelected={onFilesSelected}
      onFilesValidationFailed={onFilesValidationFailed}
      renderUploadTrigger={renderImportTrigger}
      type={PICKER_TYPES.FILE}
    />
  )
}

FileUpload.propTypes = {
  setData: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
}

export {
  FileUpload,
}
