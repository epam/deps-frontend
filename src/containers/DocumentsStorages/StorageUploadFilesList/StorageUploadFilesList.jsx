
import PropTypes from 'prop-types'
import { useState } from 'react'
import { UploadStatus } from '@/enums/UploadStatus'
import { storageFileShape } from '../models/StorageFile'
import { StorageUploadFile } from '../StorageUploadFile'
import { ToggleButton } from '../ToggleButton'
import { DocumentsTable } from './StorageUploadFilesList.styles'

const DOCUMENTS_COUNT_TO_COLLAPSE = 3

const StorageUploadFilesList = ({
  files,
  removeFile,
  uploadStatus,
}) => {
  const [isListCollapsed, setIsListCollapsed] = useState(true)

  const toggleListView = () => setIsListCollapsed((prev) => !prev)

  const getFilesToRender = () => {
    if (isListCollapsed) {
      return files.slice(0, DOCUMENTS_COUNT_TO_COLLAPSE)
    }

    return files
  }

  return (
    <DocumentsTable>
      {
        getFilesToRender().map((file) => (
          <StorageUploadFile
            key={file.id}
            file={file}
            removeFile={removeFile}
            uploadStatus={uploadStatus}
          />
        ))
      }
      {
        files.length > DOCUMENTS_COUNT_TO_COLLAPSE &&
          (
            <ToggleButton
              documentsCount={files.length}
              isCollapsed={isListCollapsed}
              toggleView={toggleListView}
            />
          )
      }
    </DocumentsTable>
  )
}

StorageUploadFilesList.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.oneOfType([
      storageFileShape,
    ]),
  ),
  removeFile: PropTypes.func.isRequired,
  uploadStatus: PropTypes.oneOf(Object.values(UploadStatus)),
}

export {
  StorageUploadFilesList,
}
