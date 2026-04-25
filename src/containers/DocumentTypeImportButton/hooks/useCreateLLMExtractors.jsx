
import { useCallback } from 'react'
import { useCreateLLMExtractorMutation } from '@/apiRTK/documentTypeApi'
import { sendRequests } from '@/utils/sendRequests'
import { mapLLMExtractorToCreationRequest } from '../mappers'

const useCreateLLMExtractors = ({
  documentTypeDataRef,
  increaseRequestCount,
  llmExtractorsIdsMappingRef,
}) => {
  const [createLLMExtractor] = useCreateLLMExtractorMutation()

  const createLLMExtractors = useCallback(async () => {
    const { name: documentTypeName, llmExtractors } = documentTypeDataRef.current

    const requests = llmExtractors.map((llmExtractor) => async () => {
      const { extractorId: createdExtractorId } = await createLLMExtractor({
        documentTypeName,
        ...mapLLMExtractorToCreationRequest(llmExtractor),
      }).unwrap()

      llmExtractorsIdsMappingRef.current = {
        ...llmExtractorsIdsMappingRef.current,
        [llmExtractor.extractorId]: createdExtractorId,
      }

      increaseRequestCount()
    })

    await sendRequests(requests, true)
  }, [
    createLLMExtractor,
    documentTypeDataRef,
    increaseRequestCount,
    llmExtractorsIdsMappingRef,
  ])

  return { createLLMExtractors }
}

export {
  useCreateLLMExtractors,
}
