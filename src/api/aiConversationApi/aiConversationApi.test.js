
import { mockEnv } from '@/mocks/mockEnv'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'
import {
  createAiCompletion,
  deleteAiConversation,
  getAiConversationData,
  deleteAiConversationMessages,
} from './aiConversationApi'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/apiRequest')

test('should call to the apiRequest.get with correct url and data when calling getAiConversationData', async () => {
  const mockDocumentId = 'documentId'

  await getAiConversationData(mockDocumentId)

  expect(apiRequest.get).toHaveBeenNthCalledWith(
    1,
    apiMap.apiGatewayV2.v5.documents.document.conversation(mockDocumentId),
  )
})

test('should call to the apiRequest.put with correct url and data when calling createCompletion', async () => {
  const mockDocumentId = 'documentId'
  const data = {
    data: 'data',
  }

  await createAiCompletion(mockDocumentId, data)

  expect(apiRequest.put).toHaveBeenNthCalledWith(
    1,
    apiMap.apiGatewayV2.v5.documents.document.conversation(mockDocumentId),
    data,
  )
})

test('should call to the apiRequest.delete with correct url when calling deleteAiConversation', async () => {
  const mockDocumentId = 'documentId'

  await deleteAiConversation(mockDocumentId)

  expect(apiRequest.delete).toHaveBeenNthCalledWith(
    1,
    apiMap.apiGatewayV2.v5.documents.document.conversation(mockDocumentId),
  )
})

test('should call to the apiRequest.delete with correct url when calling deleteAiConversationMessages', async () => {
  const mockDocumentId = 'documentId'

  const mockMessageId = 'messageId'

  await deleteAiConversationMessages(mockDocumentId, mockMessageId)

  expect(apiRequest.delete).toHaveBeenNthCalledWith(
    2,
    apiMap.apiGatewayV2.v5.documents.document.conversation.completions(mockDocumentId, [mockMessageId]),
  )
})
