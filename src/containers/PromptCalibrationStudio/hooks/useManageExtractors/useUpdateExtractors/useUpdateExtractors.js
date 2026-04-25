
import { useCallback } from 'react'
import {
  useUpdateLLMExtractorMutation,
  useUpdateExtractorLLMReferenceMutation,
} from '@/apiRTK/documentTypeApi'
import { mapExtractorToLLMExtractor } from '@/containers/PromptCalibrationStudio/mappers'
import { sendBatchRequests } from '@/containers/PromptCalibrationStudio/utils'

const BATCH_REQUESTS_COUNT = 3

export const useUpdateExtractors = () => {
  const [updateLLMExtractor] = useUpdateLLMExtractorMutation()
  const [updateExtractorLLMReference] = useUpdateExtractorLLMReferenceMutation()

  const updateExtractors = useCallback(async (
    documentTypeId,
    extractors,
    initialExtractors,
  ) => {
    const requests = extractors.map((updatedExtractor) => async () => {
      const initialExtractor = initialExtractors.find(
        (extractor) => extractor.id === updatedExtractor.id,
      )

      const {
        provider,
        model,
        extractorName,
        extractionParams,
      } = mapExtractorToLLMExtractor(updatedExtractor)

      if (initialExtractor.model !== updatedExtractor.model) {
        await updateExtractorLLMReference({
          documentTypeId,
          extractorId: updatedExtractor.id,
          data: {
            provider,
            model,
          },
        }).unwrap()
      }

      await updateLLMExtractor({
        documentTypeId,
        extractorId: updatedExtractor.id,
        data: {
          name: extractorName,
          extractionParams,
        },
      }).unwrap()
    })

    await sendBatchRequests(requests, BATCH_REQUESTS_COUNT)
  }, [updateLLMExtractor, updateExtractorLLMReference])

  return {
    updateExtractors,
  }
}
