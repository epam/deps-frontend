
import { mockEnv } from '@/mocks/mockEnv'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'
import {
  createGenAiField,
  deleteGenAiFields,
  getGenAiFields,
  sendGenAiRequestWithContext,
  updateGenAiField,
} from './prompterApi'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/apiRequest')
jest.mock('@/utils/apiMap')

const FAKE_API_URI = 'FAKE_API_URI'
const FAKE_API_RESPONSE = 'FAKE_API_RESPONSE'

describe('Service: genAIChat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call to the apiRequest.post with correct url in case of calling sendGenAiRequestWithContext', async () => {
    const requestData = {
      model: 'mockModel',
      content: 'mockMessage',
    }
    const mockDocumentId = 'id'

    apiMap.prompter.v1.dial.requestWithContext.mockImplementation(() => FAKE_API_URI)
    apiRequest.post.mockImplementation(() => Promise.resolve(FAKE_API_RESPONSE))

    const answer = await sendGenAiRequestWithContext(mockDocumentId, requestData)

    expect(apiMap.prompter.v1.dial.requestWithContext).nthCalledWith(1, mockDocumentId)
    expect(apiRequest.post).nthCalledWith(
      1,
      FAKE_API_URI,
      requestData,
    )
    expect(answer).toBe(FAKE_API_RESPONSE)
  })

  it('should call apiRequest.get with correct url in case of calling getGenAiFields', async () => {
    apiMap.prompter.v1.documents.document.keyValues.mockImplementationOnce((id) => `${FAKE_API_URI}/${id}`)
    apiRequest.get.mockImplementationOnce(() => FAKE_API_RESPONSE)
    const mockDocumentId = 'id'

    const fields = await getGenAiFields(mockDocumentId)

    const expectedRequestUrl = `${FAKE_API_URI}/${mockDocumentId}`
    expect(apiMap.prompter.v1.documents.document.keyValues).nthCalledWith(1, mockDocumentId)
    expect(apiRequest.get).nthCalledWith(
      1,
      expectedRequestUrl,
    )
    expect(fields).toEqual(FAKE_API_RESPONSE)
  })

  it('should call apiRequest.post with correct url in case of calling createGenAiField', async () => {
    apiMap.prompter.v1.documents.document.keyValues.mockImplementationOnce((id) => `${FAKE_API_URI}/${id}`)
    apiRequest.post.mockImplementationOnce(() => FAKE_API_RESPONSE)
    const mockDocumentId = 'id'
    const mockFieldData = 'mockData'

    const fields = await createGenAiField(mockDocumentId, mockFieldData)

    const expectedRequestUrl = `${FAKE_API_URI}/${mockDocumentId}`
    expect(apiMap.prompter.v1.documents.document.keyValues).nthCalledWith(1, mockDocumentId)
    expect(apiRequest.post).nthCalledWith(
      1,
      expectedRequestUrl,
      mockFieldData,
    )

    expect(fields).toEqual(FAKE_API_RESPONSE)
  })

  it('should call apiRequest.put with correct url in case of calling updateGenAiField', async () => {
    apiMap.prompter.v1.documents.document.keyValues.mockImplementationOnce((id) => `${FAKE_API_URI}/${id}`)
    apiRequest.put.mockImplementationOnce(() => FAKE_API_RESPONSE)
    const mockDocumentId = 'id'
    const mockFieldData = 'mockData'

    const fields = await updateGenAiField(mockDocumentId, mockFieldData)

    const expectedRequestUrl = `${FAKE_API_URI}/${mockDocumentId}`
    expect(apiMap.prompter.v1.documents.document.keyValues).nthCalledWith(1, mockDocumentId)
    expect(apiRequest.put).nthCalledWith(
      1,
      expectedRequestUrl,
      mockFieldData,
    )

    expect(fields).toEqual(FAKE_API_RESPONSE)
  })

  it('should call apiRequest.delete with correct url in case of calling deleteGenAiFields', async () => {
    apiMap.prompter.v1.documents.document.keyValues.keys.mockImplementationOnce(
      (id, key) => `${FAKE_API_URI}/${id}?keys=${key}`)
    apiRequest.delete.mockImplementationOnce(() => FAKE_API_RESPONSE)
    const mockDocumentId = 'id'
    const mockKey = 'mockKey'

    const fields = await deleteGenAiFields(mockDocumentId, mockKey)

    const expectedRequestUrl = `${FAKE_API_URI}/${mockDocumentId}?keys=${mockKey}`
    expect(apiMap.prompter.v1.documents.document.keyValues.keys).nthCalledWith(1, mockDocumentId, mockKey)
    expect(apiRequest.delete).toHaveBeenCalledWith(expectedRequestUrl)
    expect(fields).toEqual(FAKE_API_RESPONSE)
  })
})
