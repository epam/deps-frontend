
import PropTypes from 'prop-types'
import useDrivePicker from 'react-google-drive-picker'
import { GoogleDriveIcon } from '@/components/Icons/GoogleDriveIcon'
import { storageFileShape } from '@/containers/DocumentsStorages/models/StorageFile'
import { StorageButton } from '@/containers/DocumentsStorages/StorageButton'
import { StorageUploadFilesList } from '@/containers/DocumentsStorages/StorageUploadFilesList'
import { ValidationService } from '@/containers/DocumentsStorages/ValidationService'
import { FileExtension } from '@/enums/FileExtension'
import { FilesStorage } from '@/enums/FilesStorage'
import { MimeType } from '@/enums/MimeType'
import { UploadStatus } from '@/enums/UploadStatus'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'

const VIEW_ID = 'DOCS'
const MAX_FILE_SIZE_MB = 100
const GOOGLE_DRIVE_CUSTOM_SCOPE = 'https://www.googleapis.com/auth/drive'

const SUPPORTED_GOOGLE_DRIVE_MIME_TYPES = [
  MimeType.APPLICATION_GOOGLE_DOCUMENT,
  MimeType.APPLICATION_GOOGLE_SPREADSHEET,
]

const SUPPORTED_EXTENSIONS = [
  FileExtension.JPG,
  FileExtension.JPEG,
  FileExtension.PNG,
  FileExtension.PDF,
  FileExtension.XLSX,
  FileExtension.XLS,
  FileExtension.DOCX,
]

const SUPPORTED_FORMATS = `${SUPPORTED_EXTENSIONS.join(', ')}, Google Sheets, Google Docs`

const GoogleDrivePicker = ({
  disabled,
  files,
  onFileValidationFailed,
  onSizeValidationFailed,
  setFiles,
  uploadStatus,
}) => {
  const [openPicker] = useDrivePicker()

  const getUnsupportedFiles = (files) => (
    files.filter((file) => {
      const isSizeValid = ValidationService.isSizeValid(
        MAX_FILE_SIZE_MB,
        file.sizeBytes,
      )

      !isSizeValid && onSizeValidationFailed()

      const isCreatedWithGoogleDrive = Object.values(SUPPORTED_GOOGLE_DRIVE_MIME_TYPES).includes(file.mimeType)
      const isFormatValid = isCreatedWithGoogleDrive || (
        ValidationService.isFormatValid(
          SUPPORTED_EXTENSIONS,
          file.mimeType,
          file.name,
        ))

      return !isSizeValid || !isFormatValid
    })
  )

  const handleValidationFail = (unsupportedFiles, allFiles) => {
    const unsupportedFilesNames = unsupportedFiles.map((file) => file.name)

    onFileValidationFailed(unsupportedFilesNames, allFiles)
  }

  const pickerCallback = ({ docs }) => {
    if (!docs) {
      return
    }

    const unsupportedFiles = getUnsupportedFiles(docs)

    !!unsupportedFiles.length &&
    handleValidationFail(unsupportedFiles, docs)

    if (unsupportedFiles.length === docs.length) {
      return
    }

    const validFiles = (
      unsupportedFiles.length
        ? docs.filter((doc) => !unsupportedFiles.some((file) => file.id === doc.id))
        : docs
    )

    const alreadyUploadedFilesIds = files.map((file) => file.id)
    const filteredFiles = validFiles.filter((doc) => (
      !alreadyUploadedFilesIds.includes(doc.id)
    ))
    const filesToSet = uploadStatus ? validFiles : [...files, ...filteredFiles]

    setFiles(FilesStorage.GOOGLE_DRIVE, filesToSet)
  }

  const handleOpenPicker = () => (
    openPicker({
      clientId: ENV.GOOGLE_DRIVE_CLIENT_ID,
      developerKey: ENV.GOOGLE_DRIVE_API_KEY,
      viewId: VIEW_ID,
      supportDrives: true,
      multiselect: true,
      callbackFunction: pickerCallback,
      customScopes: [GOOGLE_DRIVE_CUSTOM_SCOPE],
    })
  )

  const removeFile = (id) => {
    const filteredFiles = files.filter((file) => file.id !== id)

    setFiles(FilesStorage.GOOGLE_DRIVE, filteredFiles)
  }

  return (
    <>
      <StorageButton
        disabled={disabled}
        icon={<GoogleDriveIcon />}
        isActive={!!files.length}
        onClick={handleOpenPicker}
        storageName={localize(Localization.GOOGLE_DRIVE)}
        title={
          localize(
            Localization.SUPPORTED_FORMATS, {
              formats: SUPPORTED_FORMATS,
            },
          )
        }
      />
      {
        !!files.length && (
          <StorageUploadFilesList
            files={files}
            removeFile={removeFile}
            uploadStatus={uploadStatus}
          />
        )
      }
    </>
  )
}

GoogleDrivePicker.propTypes = {
  disabled: PropTypes.bool.isRequired,
  files: PropTypes.arrayOf(
    storageFileShape,
  ),
  onFileValidationFailed: PropTypes.func.isRequired,
  onSizeValidationFailed: PropTypes.func.isRequired,
  setFiles: PropTypes.func.isRequired,
  uploadStatus: PropTypes.oneOf(Object.values(UploadStatus)),
}

export {
  GoogleDrivePicker,
}
