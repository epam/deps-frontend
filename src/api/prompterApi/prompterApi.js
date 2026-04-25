
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const sendGenAiRequestWithContext = (documentId, requestData) => apiRequest.post(apiMap.prompter.v1.dial.requestWithContext(documentId), requestData)

const getGenAiFields = (documentId) => apiRequest.get(apiMap.prompter.v1.documents.document.keyValues(documentId))

const createGenAiField = (documentId, data) => apiRequest.post(apiMap.prompter.v1.documents.document.keyValues(documentId), data)

const updateGenAiField = (documentId, data) => apiRequest.put(apiMap.prompter.v1.documents.document.keyValues(documentId), data)

const deleteGenAiFields = (documentId, ids) => apiRequest.delete(apiMap.prompter.v1.documents.document.keyValues.keys(documentId, ids))

export {
  sendGenAiRequestWithContext,
  getGenAiFields,
  createGenAiField,
  updateGenAiField,
  deleteGenAiFields,
}
