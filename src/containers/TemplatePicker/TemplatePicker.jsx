
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { ButtonType } from '@/components/Button'
import { PICKER_TYPES } from '@/components/FilesPicker'
import { FaRotateIcon } from '@/components/Icons/FaRotateIcon'
import { Tooltip } from '@/components/Tooltip'
import { SUPPORTED_EXTENSIONS_TEMPLATES } from '@/constants/common'
import { UnsupportedFilesList } from '@/containers/UnsupportedFilesList'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { getMime } from '@/utils/getMime'
import { notifyWarning } from '@/utils/notification'
import { FilesPicker, UploadIcon, Button, FilePickerWrapper } from './TemplatePicker.styles'
import { UploadCard } from './UploadCard'

const SUPPORTED_FORMATS = localize(Localization.SUPPORTED_FORMATS, { formats: SUPPORTED_EXTENSIONS_TEMPLATES.join(', ') })

const TemplatePicker = ({ file, setUploadedFile }) => {
  const getUploadedFile = useCallback((file) => {
    const [uploadedFile] = file

    setUploadedFile(uploadedFile)
  }, [setUploadedFile])

  const renderOpenButton = useCallback(() => (
    <Button
      icon={<UploadIcon />}
      type={ButtonType.DEFAULT}
    >
      {localize(Localization.UPLOAD)}
    </Button>
  ), [])

  const onFilesValidationFailed = (unsupportedFiles) => {
    notifyWarning(<UnsupportedFilesList files={unsupportedFiles} />)
  }

  const showUnsupportedSizeMessage = () => notifyWarning(localize(Localization.FILE_SIZE_IS_TOO_LARGE))

  const getFileMime = async (file) => {
    if (SUPPORTED_EXTENSIONS_TEMPLATES.includes(file.type)) {
      return file.type
    }
    return await getMime(file)
  }

  const FilesPickerComponent = useMemo(() => (
    <FilesPicker
      accept={SUPPORTED_EXTENSIONS_TEMPLATES.join(', ')}
      disabled={false}
      getMime={getFileMime}
      maxFileSize={ENV.MAX_FILE_SIZE_MB}
      multiple={false}
      onFileSizeValidationFailed={showUnsupportedSizeMessage}
      onFilesSelected={getUploadedFile}
      onFilesValidationFailed={onFilesValidationFailed}
      type={file ? PICKER_TYPES.FILE : PICKER_TYPES.DRAGGER}
      {...(file && { icon: <FaRotateIcon /> })}
      {...(!file && {
        text: localize(Localization.UPLOAD_TEMPLATES_DRAG_TEXT),
        description: SUPPORTED_FORMATS,
      })}
    >
      {!file && renderOpenButton()}
    </FilesPicker>
  ), [file, getUploadedFile, renderOpenButton])

  if (file) {
    return (
      <UploadCard file={file}>
        <Tooltip
          placement={Placement.TOP_RIGHT}
          title={localize(Localization.REPLACE_EXISTING_FILE)}
        >
          <FilePickerWrapper>
            {FilesPickerComponent}
          </FilePickerWrapper>
        </Tooltip>
      </UploadCard>
    )
  }

  return FilesPickerComponent
}

TemplatePicker.propTypes = {
  setUploadedFile: PropTypes.func.isRequired,
  file: PropTypes.shape({
    uid: PropTypes.string,
    mime: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number,
  }),
}

export {
  TemplatePicker,
}
