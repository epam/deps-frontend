
import { useCallback } from 'react'
import { useCreateLLMExtractorQueryMutation } from '@/apiRTK/documentTypeApi'
import { useCreateExtractionFieldMutation } from '@/apiRTK/extractionFieldsApi'
import {
  mapFieldToExtractionField,
  mapFieldToLLMQuery,
} from '@/containers/PromptCalibrationStudio/mappers'
import { sendBatchRequests } from '@/containers/PromptCalibrationStudio/utils'

const BATCH_REQUESTS_COUNT = 3

export const useCreateFields = () => {
  const [createExtractionField] = useCreateExtractionFieldMutation()
  const [createLLMExtractorQuery] = useCreateLLMExtractorQueryMutation()

  const createFields = useCallback(async (
    documentTypeId,
    fields,
  ) => {
    const requests = fields.map((field) => async () => {
      const extractionField = await createExtractionField({
        documentTypeCode: documentTypeId,
        field: mapFieldToExtractionField(field),
      }).unwrap()

      await createLLMExtractorQuery({
        documentTypeId,
        extractorId: field.extractorId,
        data: {
          ...mapFieldToLLMQuery(extractionField.code, field),
        },
      }).unwrap()
    })

    await sendBatchRequests(requests, BATCH_REQUESTS_COUNT)
  }, [createExtractionField, createLLMExtractorQuery])

  return {
    createFields,
  }
}
