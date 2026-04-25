
import { useCallback } from 'react'
import { useParams } from 'react-router'
import { useRetrieveInsightsMutation } from '@/apiRTK/LLMsApi'

export const useRetrieveInsights = () => {
  const { documentId, fileId } = useParams()

  const [
    retrieveDocumentInsights,
    { isLoading: isRetrievingDocumentInsights },
  ] = useRetrieveInsightsMutation()

  const retrieveInsights = useCallback((params) => {
    const id = documentId || fileId

    return retrieveDocumentInsights({
      id,
      ...params,
    })
  }, [
    documentId,
    fileId,
    retrieveDocumentInsights,
  ])

  return [retrieveInsights, isRetrievingDocumentInsights]
}
