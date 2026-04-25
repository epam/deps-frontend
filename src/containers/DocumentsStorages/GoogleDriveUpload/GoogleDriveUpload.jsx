
import PropTypes from 'prop-types'
import { useEffect, useCallback } from 'react'
import { documentsApi } from '@/api/documentsApi'
import { GoogleDrivePicker } from '@/containers/DocumentsStorages/GoogleDriveUpload/GoogleDrivePicker'
import { fileImportConfigShape } from '@/containers/DocumentsStorages/models/FileImportConfig'
import { FilesStorage } from '@/enums/FilesStorage'
import { UploadStatus } from '@/enums/UploadStatus'
import { Localization, localize } from '@/localization/i18n'
import { notifyError, notifySuccess } from '@/utils/notification'
import { storageFileShape } from '../models/StorageFile'
import { useGoogleDriveApi } from './useGoogleDriveApi'

const GoogleDriveUpload = ({
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
  const { sharePermission } = useGoogleDriveApi()

  const uploadFiles = useCallback(async () => {
    try {
      updateUploadStatus(FilesStorage.GOOGLE_DRIVE, UploadStatus.PENDING)
      await sharePermission({
        filesId: files.map(({ id }) => id),
      })
      await documentsApi.importDocuments(fileImportConfig)
      notifySuccess(localize(
        Localization.STORAGE_UPLOADS_SUCCESS_STATUS, {
          storageName: localize(Localization.GOOGLE_DRIVE),
        },
      ))
      updateUploadStatus(FilesStorage.GOOGLE_DRIVE, UploadStatus.SUCCESS)
    } catch (error) {
      updateUploadStatus(FilesStorage.GOOGLE_DRIVE, UploadStatus.FAILURE)
      notifyError(localize(
        Localization.UPLOADS_FAILURE_STATUS, {
          storageName: localize(Localization.GOOGLE_DRIVE),
        },
      ))
    } finally {
      onUploadComplete()
    }
  }, [
    files,
    fileImportConfig,
    onUploadComplete,
    sharePermission,
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
    <GoogleDrivePicker
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

GoogleDriveUpload.propTypes = {
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
  GoogleDriveUpload,
}
