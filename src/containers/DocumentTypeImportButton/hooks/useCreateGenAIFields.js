
import { useCallback } from 'react'
import { useCreateLLMExtractorQueryMutation } from '@/apiRTK/documentTypeApi'
import { useCreateExtractionFieldMutation } from '@/apiRTK/extractionFieldsApi'
import { sendRequests } from '@/utils/sendRequests'
import { CREATE_GEN_AI_FIELD_REQUESTS_COUNT } from '../constants'
import { mapFieldToGenAIFieldCreationRequest } from '../mappers'

const useCreateGenAIFields = ({
  documentTypeDataRef,
  fieldsCodesMappingRef,
  increaseRequestCount,
  llmExtractorsIdsMappingRef,
}) => {
  const [createExtractionField] = useCreateExtractionFieldMutation()
  const [createLLMExtractorQuery] = useCreateLLMExtractorQueryMutation()

  const createGenAIFields = useCallback(async () => {
    const { documentTypeId, genAIFields, llmExtractors } = documentTypeDataRef.current

    const requests = genAIFields.map((field) => async () => {
      const { fieldData, queryData } = mapFieldToGenAIFieldCreationRequest(field, llmExtractors, llmExtractorsIdsMappingRef.current)

      const extractionField = await createExtractionField({
        documentTypeCode: documentTypeId,
        field: fieldData,
      }).unwrap()

      await createLLMExtractorQuery({
        documentTypeId,
        extractorId: fieldData.extractorId,
        data: {
          code: extractionField.code,
          ...queryData,
        },
      }).unwrap()

      fieldsCodesMappingRef.current = {
        ...fieldsCodesMappingRef.current,
        [field.code]: extractionField.code,
      }

      increaseRequestCount(CREATE_GEN_AI_FIELD_REQUESTS_COUNT)
    })

    await sendRequests(requests, true)
  }, [
    createExtractionField,
    createLLMExtractorQuery,
    documentTypeDataRef,
    fieldsCodesMappingRef,
    increaseRequestCount,
    llmExtractorsIdsMappingRef,
  ])

  return { createGenAIFields }
}

export {
  useCreateGenAIFields,
}
