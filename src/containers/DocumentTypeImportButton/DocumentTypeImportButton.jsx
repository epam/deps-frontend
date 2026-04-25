
import {
  useCallback,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { EXPORT_FIELDS } from '@/constants/documentType'
import { ProgressModal } from '@/containers/ProgressModal'
import { Localization, localize } from '@/localization/i18n'
import { readFileData } from '@/utils/file'
import { jsonTryParse } from '@/utils/jsonTryParse'
import { notifyWarning } from '@/utils/notification'
import { DocumentTypeImportDrawer } from './DocumentTypeImportDrawer'
import { FileUpload } from './FileUpload'
import { useUploadDocumentType } from './hooks/useUploadDocumentType'

const isImportedDataValid = (data) => (
  typeof data === 'object' &&
  data !== null &&
  Object.keys(data).length === Object.values(EXPORT_FIELDS).length &&
  Object.keys(data).every((key) => Object.values(EXPORT_FIELDS).includes(key))
)

const parseFileData = async (file) => {
  const result = await readFileData(file)
  const data = jsonTryParse(result)

  if (
    !result ||
    !data ||
    !isImportedDataValid(data)
  ) {
    throw new Error(localize(Localization.SELECTED_FILE_ERROR))
  }

  return data
}

const DocumentTypeImportButton = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [documentTypeData, setDocumentTypeData] = useState(null)
  const [fileName, setFileName] = useState(null)

  const dispatch = useDispatch()

  const onAfterUpload = useCallback(() => {
    dispatch(fetchDocumentTypes())
  }, [dispatch])

  const toggleDrawer = useCallback(() =>
    setIsDrawerVisible((prev) => !prev),
  [])

  const {
    isValidatingDocumentTypeName,
    isUploading,
    onUpload,
    currentRequestsCount,
    totalRequestsCount,
  } = useUploadDocumentType({
    onAfterUpload,
    onBeforeImport: toggleDrawer,
  })

  const parseAndSetFileData = useCallback(async (file, shouldToggleDrawer) => {
    try {
      const data = await parseFileData(file)
      setFileName(file.name)
      setDocumentTypeData(data)
      shouldToggleDrawer && toggleDrawer()
    } catch {
      notifyWarning(localize(Localization.SELECTED_FILE_ERROR))
    }
  }, [toggleDrawer])

  const setData = useCallback(async (file) => {
    await parseAndSetFileData(file, true)
  }, [parseAndSetFileData])

  const changeData = useCallback(async (file) => {
    await parseAndSetFileData(file, false)
  }, [parseAndSetFileData])

  const onCancel = useCallback(async () => {
    toggleDrawer()
    setDocumentTypeData(null)
    setFileName(null)
  }, [toggleDrawer])

  const upload = useCallback(async (formValues) => {
    const data = {
      ...documentTypeData,
      name: formValues.name,
    }

    setDocumentTypeData(data)
    await onUpload(data)
  }, [
    documentTypeData,
    onUpload,
  ])

  return (
    <>
      <FileUpload
        setData={setData}
      />
      {
        documentTypeData && (
          <DocumentTypeImportDrawer
            closeDrawer={onCancel}
            documentTypeName={documentTypeData.name}
            fileName={fileName}
            loading={isValidatingDocumentTypeName}
            setData={changeData}
            upload={upload}
            visible={isDrawerVisible}
          />
        )
      }
      {
        isUploading && (
          <ProgressModal
            current={currentRequestsCount}
            title={documentTypeData.name}
            total={totalRequestsCount}
          />
        )
      }
    </>
  )
}

export {
  DocumentTypeImportButton,
}
