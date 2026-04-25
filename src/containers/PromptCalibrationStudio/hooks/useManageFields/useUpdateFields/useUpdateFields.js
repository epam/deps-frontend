
import isEqual from 'lodash/isEqual'
import { useCallback } from 'react'
import {
  useMoveLLMExtractorQueryMutation,
  useUpdateLLMExtractorQueryMutation,
} from '@/apiRTK/documentTypeApi'
import { useUpdateExtractionFieldMutation } from '@/apiRTK/extractionFieldsApi'
import {
  mapFieldToExtractionField,
  mapFieldToLLMQuery,
} from '@/containers/PromptCalibrationStudio/mappers'
import { sendBatchRequests } from '@/containers/PromptCalibrationStudio/utils'

const BATCH_REQUESTS_COUNT = 3

export const useUpdateFields = () => {
  const [updateExtractionField] = useUpdateExtractionFieldMutation()
  const [moveLLMExtractorQuery] = useMoveLLMExtractorQueryMutation()
  const [updateLLMExtractorQuery] = useUpdateLLMExtractorQueryMutation()

  const updateFields = useCallback(async (
    documentTypeCode,
    fields,
    initialFields,
  ) => {
    const requests = fields.map((updatedField) => async () => {
      const initialField = initialFields.find((field) => field.id === updatedField.id)
      const { extractorId, id: fieldCode } = updatedField

      if (initialField.extractorId !== extractorId) {
        await moveLLMExtractorQuery({
          documentTypeId: documentTypeCode,
          data: {
            sourceExtractorId: initialField.extractorId,
            targetExtractorId: extractorId,
            fieldsCodes: [fieldCode],
          },
        }).unwrap()
      }

      if (
        initialField.extractorId !== extractorId ||
        initialField.name !== updatedField.name ||
        initialField.order !== updatedField.order
      ) {
        await updateExtractionField({
          documentTypeCode,
          extractorId,
          fieldCode,
          data: mapFieldToExtractionField(updatedField),
        }).unwrap()
      }

      if (!isEqual(initialField.query.nodes, updatedField.query.nodes)) {
        await updateLLMExtractorQuery({
          documentTypeId: documentTypeCode,
          extractorId,
          fieldCode,
          data: { ...mapFieldToLLMQuery(fieldCode, updatedField) },
        }).unwrap()
      }
    })

    await sendBatchRequests(requests, BATCH_REQUESTS_COUNT)
  }, [updateExtractionField, moveLLMExtractorQuery, updateLLMExtractorQuery])

  return {
    updateFields,
  }
}
