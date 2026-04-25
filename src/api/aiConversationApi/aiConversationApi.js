
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

export const getAiConversationData = (documentId) => (
  apiRequest.get(apiMap.apiGatewayV2.v5.documents.document.conversation(documentId))
)

export const createAiCompletion = (documentId, data) => (
  apiRequest.put(apiMap.apiGatewayV2.v5.documents.document.conversation(documentId), data)
)

export const deleteAiConversation = (documentId) => (
  apiRequest.delete(apiMap.apiGatewayV2.v5.documents.document.conversation(documentId))
)

export const deleteAiConversationMessages = (documentId, messageId) => (
  apiRequest.delete(apiMap.apiGatewayV2.v5.documents.document.conversation.completions(documentId, [messageId]))
)
