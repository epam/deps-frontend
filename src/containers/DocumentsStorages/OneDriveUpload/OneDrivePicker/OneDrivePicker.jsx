
import PropTypes from 'prop-types'
import { OneDriveIcon } from '@/components/Icons/OneDriveIcon'
import {
  StorageFile,
  storageFileShape,
} from '@/containers/DocumentsStorages/models/StorageFile'
import { StorageButton } from '@/containers/DocumentsStorages/StorageButton'
import { StorageUploadFilesList } from '@/containers/DocumentsStorages/StorageUploadFilesList'
import { ValidationService } from '@/containers/DocumentsStorages/ValidationService'
import { FileExtension } from '@/enums/FileExtension'
import { FilesStorage } from '@/enums/FilesStorage'
import { UploadStatus } from '@/enums/UploadStatus'
import { useDynamicScript } from '@/hooks/useDynamicScript'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { notifyWarning } from '@/utils/notification'
import { useOneDriveApi } from '../useOneDriveApi'

const ONE_DRIVE_ACTION = 'share'
const ONE_DRIVE_API_URL = 'api.onedrive.com'
const ONE_DRIVE_PICKER_URL = 'https://js.live.net/v7.2/OneDrive.js'
const AvailableScopes = ['OneDrive.ReadWrite']

const SUPPORTED_EXTENSIONS = [
  FileExtension.JPG,
  FileExtension.JPEG,
  FileExtension.PNG,
  FileExtension.PDF,
  FileExtension.XLSX,
  FileExtension.XLS,
  FileExtension.DOCX,
]

const mapResponseToStorageFiles = (response) => (
  response.map(({ id, size, file, name }) => (
    new StorageFile({
      id,
      sizeBytes: size,
      name,
      mimeType: file.mimeType,
    })
  ))
)

const OneDrivePicker = ({
  disabled,
  files,
  onFileValidationFailed,
  onSizeValidationFailed,
  setFiles,
  uploadStatus,
}) => {
  const { ready } = useDynamicScript(ONE_DRIVE_PICKER_URL)
  const { getToken, initApi } = useOneDriveApi()

  const getUnsupportedFiles = (files) => (
    files.filter((file) => {
      const isSizeValid = ValidationService.isSizeValid(
        ENV.MAX_FILE_SIZE_MB,
        file.sizeBytes,
      )

      !isSizeValid && onSizeValidationFailed()

      const isFormatValid = (
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

  const pickerCallback = ({ value }) => {
    if (!value) {
      return
    }

    const oneDriveFiles = mapResponseToStorageFiles(value)
    const unsupportedFiles = getUnsupportedFiles(oneDriveFiles)

    !!unsupportedFiles.length &&
    handleValidationFail(unsupportedFiles, oneDriveFiles)

    if (unsupportedFiles.length === oneDriveFiles.length) {
      return
    }

    const validFiles = (
      unsupportedFiles.length
        ? oneDriveFiles.filter((doc) => !unsupportedFiles.some((file) => file.id === doc.id))
        : oneDriveFiles
    )

    const alreadyUploadedFilesIds = files.map((file) => file.id)
    const filteredFiles = validFiles.filter((doc) => (
      !alreadyUploadedFilesIds.includes(doc.id)
    ))
    const filesToSet = uploadStatus ? validFiles : [...files, ...filteredFiles]

    setFiles(FilesStorage.ONE_DRIVE, filesToSet)
  }

  const handleOpenPicker = async () => {
    await initApi()

    // eslint-disable-next-line no-undef
    return OneDrive.open({
      clientId: ENV.ONE_DRIVE_CLIENT_ID,
      action: ONE_DRIVE_ACTION,
      multiSelect: true,
      accountSwitchEnabled: true,
      advanced: {
        redirectUri: window.location.origin,
        accessToken: await getToken(AvailableScopes),
        endpointHint: ONE_DRIVE_API_URL,
      },
      success: pickerCallback,
      error: () => notifyWarning(localize(Localization.DEFAULT_ERROR)),
    })
  }

  const removeFile = (id) => {
    const filteredFiles = files.filter((file) => file.id !== id)

    setFiles(FilesStorage.ONE_DRIVE, filteredFiles)
  }

  return (
    <>
      <StorageButton
        disabled={disabled && ready}
        icon={<OneDriveIcon />}
        isActive={!!files.length}
        onClick={handleOpenPicker}
        storageName={localize(Localization.ONE_DRIVE)}
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

OneDrivePicker.propTypes = {
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
  OneDrivePicker,
}
