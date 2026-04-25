
import { useCallback } from 'react'
import { useCreateLLMExtractorMutation } from '@/apiRTK/documentTypeApi'
import { mapExtractorToLLMExtractor } from '@/containers/PromptCalibrationStudio/mappers'
import { sendBatchRequests } from '@/containers/PromptCalibrationStudio/utils'

const BATCH_REQUESTS_COUNT = 3

export const useCreateExtractors = () => {
  const [createLLMExtractor] = useCreateLLMExtractorMutation()

  const createExtractors = useCallback(async (documentTypeName, extractors) => {
    const extractorIdMapping = {}

    const requests = extractors.map((extractor) => async () => {
      const { extractorId: createdExtractorId } = await createLLMExtractor({
        documentTypeName,
        ...mapExtractorToLLMExtractor(extractor),
      }).unwrap()

      extractorIdMapping[extractor.id] = createdExtractorId
    })

    await sendBatchRequests(requests, BATCH_REQUESTS_COUNT)

    return extractorIdMapping
  }, [createLLMExtractor])

  return {
    createExtractors,
  }
}
