
import PropTypes from 'prop-types'
import { FilesPicker, PICKER_TYPES } from '@/components/FilesPicker'
import { UnsupportedFilesList } from '@/containers/UnsupportedFilesList'
import { FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { getMime } from '@/utils/getMime'
import { notifyWarning } from '@/utils/notification'

const SUPPORTED_EXTENSIONS = [
  FileExtension.JPG,
  FileExtension.JPEG,
  FileExtension.PNG,
  FileExtension.PDF,
  FileExtension.TIFF,
  FileExtension.TIF,
]

const ReferenceLayoutUploader = ({
  onFilesSelected,
  renderUploadTrigger,
}) => {
  const getFileMime = async (file) => {
    if (SUPPORTED_EXTENSIONS.includes(file.type)) {
      return file.type
    }
    return await getMime(file)
  }

  const onFilesValidationFailed = (unsupportedFiles) => notifyWarning(<UnsupportedFilesList files={unsupportedFiles} />)

  const showUnsupportedSizeMessage = () =>
    notifyWarning(localize(Localization.FILE_SIZE_IS_OVER, { maxSize: ENV.MAX_PROTOTYPE_REFERENCE_LAYOUT_SIZE_MB }))

  return (
    <FilesPicker
      accept={SUPPORTED_EXTENSIONS.join(', ')}
      disabled={false}
      getMime={getFileMime}
      maxFileSize={ENV.MAX_PROTOTYPE_REFERENCE_LAYOUT_SIZE_MB}
      multiple={false}
      onFileSizeValidationFailed={showUnsupportedSizeMessage}
      onFilesSelected={onFilesSelected}
      onFilesValidationFailed={onFilesValidationFailed}
      renderUploadTrigger={renderUploadTrigger}
      type={PICKER_TYPES.FILE}
    />
  )
}

ReferenceLayoutUploader.propTypes = {
  onFilesSelected: PropTypes.func.isRequired,
  renderUploadTrigger: PropTypes.func.isRequired,
}

export {
  ReferenceLayoutUploader,
}
