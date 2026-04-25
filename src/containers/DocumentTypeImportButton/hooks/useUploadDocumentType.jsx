
import {
  useCallback,
  useRef,
  useState,
} from 'react'
import { documentTypesApi } from '@/api/documentTypesApi'
import { EXPORTABLE_EXTRACTION_TYPES } from '@/constants/documentType'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { ExtractionType, RESOURCE_EXTRACTION_TYPE } from '@/enums/ExtractionType'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import {
  CREATE_DOCUMENT_TYPE_REQUEST_COUNT,
  CREATE_GEN_AI_FIELD_REQUESTS_COUNT,
  initialValues,
} from '../constants'
import { useCreateCrossFieldValidators } from './useCreateCrossFieldValidators'
import { useCreateDocumentType } from './useCreateDocumentType'
import { useCreateGenAIFields } from './useCreateGenAIFields'
import { useCreateLLMExtractors } from './useCreateLLMExtractors'

const calculateRequestsCount = (data) => {
  const { crossFieldValidators, genAIFields, llmExtractors } = data

  return llmExtractors.length +
    genAIFields.length * CREATE_GEN_AI_FIELD_REQUESTS_COUNT +
    crossFieldValidators.length +
    CREATE_DOCUMENT_TYPE_REQUEST_COUNT
}

const useUploadDocumentType = ({ onAfterUpload, onBeforeImport }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [isValidatingDocumentTypeName, setIsValidatingDocumentTypeName] = useState(false)
  const [currentRequestsCount, setCurrentRequestsCount] = useState(initialValues.currentRequestsCount)
  const [totalRequestsCount, setTotalRequestsCount] = useState(initialValues.totalRequestsCount)

  const documentTypeDataRef = useRef(null)
  const llmExtractorsIdsMappingRef = useRef(initialValues.llmExtractorsIdsMapping)
  const fieldsCodesMappingRef = useRef(initialValues.fieldsCodesMapping)

  const increaseRequestCount = useCallback((count = 1) =>
    setCurrentRequestsCount((value) => value + count),
  [],
  )

  const { CREATE_DOCUMENT_TYPE_REQUEST } = useCreateDocumentType({
    documentTypeDataRef,
    increaseRequestCount,
  })

  const { createLLMExtractors } = useCreateLLMExtractors({
    documentTypeDataRef,
    increaseRequestCount,
    llmExtractorsIdsMappingRef,
  })

  const { createGenAIFields } = useCreateGenAIFields({
    documentTypeDataRef,
    fieldsCodesMappingRef,
    increaseRequestCount,
    llmExtractorsIdsMappingRef,
  })

  const { createCrossFieldValidators } = useCreateCrossFieldValidators({
    documentTypeDataRef,
    fieldsCodesMappingRef,
    increaseRequestCount,
  })

  const sendRequests = useCallback(async ({
    createDocumentTypeRequest,
    crossFieldValidators,
    genAIFields,
    llmExtractors,
  }) => {
    try {
      setIsUploading(true)
      await createDocumentTypeRequest()
      llmExtractors.length && await createLLMExtractors()
      genAIFields.length && await createGenAIFields()
      crossFieldValidators.length && await createCrossFieldValidators()
      notifySuccess(localize(Localization.DOCUMENT_TYPE_IMPORT_SUCCESS))
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    } finally {
      setIsUploading(false)
      await onAfterUpload()
    }
  }, [
    createCrossFieldValidators,
    createGenAIFields,
    createLLMExtractors,
    onAfterUpload,
  ])

  const checkIfNameExists = useCallback(async (name) => {
    setIsValidatingDocumentTypeName(true)
    try {
      const documentTypes = await documentTypesApi.fetchDocumentTypes()
      return documentTypes.some((type) => type.name === name)
    } finally {
      setIsValidatingDocumentTypeName(false)
    }
  }, [])

  const onUpload = useCallback(async (importedData) => {
    const extractionType = importedData.extractionType || ExtractionType.AI_PROMPTED

    if (!EXPORTABLE_EXTRACTION_TYPES.includes(extractionType)) {
      notifyWarning(localize(
        Localization.EXTRACTION_TYPE_UNSUPPORTED,
        { extractionType: RESOURCE_EXTRACTION_TYPE[extractionType] || extractionType },
      ))
      return
    }

    try {
      const isExistingName = await checkIfNameExists(importedData.name)

      if (isExistingName) {
        notifyWarning(localize(Localization.DOCUMENT_TYPE_DUPLICATE_NAME_NOTIFICATION))
        return
      }

      onBeforeImport()
      documentTypeDataRef.current = importedData
      setTotalRequestsCount(calculateRequestsCount(importedData))

      await sendRequests({
        createDocumentTypeRequest: CREATE_DOCUMENT_TYPE_REQUEST[extractionType],
        crossFieldValidators: importedData.crossFieldValidators,
        genAIFields: importedData.genAIFields,
        llmExtractors: importedData.llmExtractors,
      })
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }, [
    CREATE_DOCUMENT_TYPE_REQUEST,
    checkIfNameExists,
    sendRequests,
    onBeforeImport,
  ])

  return {
    isValidatingDocumentTypeName,
    isUploading,
    onUpload,
    currentRequestsCount,
    totalRequestsCount,
  }
}

export {
  useUploadDocumentType,
}
