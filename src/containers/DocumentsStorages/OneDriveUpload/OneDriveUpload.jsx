
import PropTypes from 'prop-types'
import { useEffect, useCallback } from 'react'
import { documentsApi } from '@/api/documentsApi'
import { fileImportConfigShape } from '@/containers/DocumentsStorages/models/FileImportConfig'
import { FilesStorage } from '@/enums/FilesStorage'
import { UploadStatus } from '@/enums/UploadStatus'
import { Localization, localize } from '@/localization/i18n'
import { notifyError, notifySuccess } from '@/utils/notification'
import { storageFileShape } from '../models/StorageFile'
import { OneDrivePicker } from './OneDrivePicker'
import { useOneDriveApi } from './useOneDriveApi'

const OneDriveUpload = ({
  onFileValidationFailed,
  onSizeValidationFailed,
  onUploadComplete,
  setFiles,
  files,
  fileImportConfig,
  uploading,
  updateUploadStatus,
  uploadStatus,
}) => {
  const { sharePermissions } = useOneDriveApi()

  const uploadFiles = useCallback(async () => {
    try {
      updateUploadStatus(FilesStorage.ONE_DRIVE, UploadStatus.PENDING)

      await sharePermissions(
        files.map(({ id }) => id),
      )

      await documentsApi.importDocuments(fileImportConfig)

      notifySuccess(localize(
        Localization.STORAGE_UPLOADS_SUCCESS_STATUS, {
          storageName: localize(Localization.ONE_DRIVE),
        },
      ))
      updateUploadStatus(FilesStorage.ONE_DRIVE, UploadStatus.SUCCESS)
    } catch (error) {
      updateUploadStatus(FilesStorage.ONE_DRIVE, UploadStatus.FAILURE)
      notifyError(localize(
        Localization.UPLOADS_FAILURE_STATUS, {
          storageName: localize(Localization.ONE_DRIVE),
        },
      ))
    } finally {
      onUploadComplete()
    }
  }, [
    fileImportConfig,
    files,
    onUploadComplete,
    sharePermissions,
    updateUploadStatus,
  ])

  useEffect(() => {
    if (
      uploading &&
      files.length &&
      !uploadStatus
    ) {
      uploadFiles()
    }
  }, [
    files.length,
    uploading,
    uploadFiles,
    uploadStatus,
  ])

  return (
    <OneDrivePicker
      disabled={uploading}
      files={files}
      onFileValidationFailed={onFileValidationFailed}
      onSizeValidationFailed={onSizeValidationFailed}
      setFiles={setFiles}
      updateUploadStatus={updateUploadStatus}
      uploadStatus={uploadStatus}
    />
  )
}

OneDriveUpload.propTypes = {
  files: PropTypes.arrayOf(storageFileShape).isRequired,
  fileImportConfig: fileImportConfigShape,
  onFileValidationFailed: PropTypes.func.isRequired,
  onUploadComplete: PropTypes.func.isRequired,
  onSizeValidationFailed: PropTypes.func.isRequired,
  setFiles: PropTypes.func.isRequired,
  uploading: PropTypes.bool.isRequired,
  uploadStatus: PropTypes.oneOf(Object.values(UploadStatus)),
  updateUploadStatus: PropTypes.func.isRequired,
}

export {
  OneDriveUpload,
}
