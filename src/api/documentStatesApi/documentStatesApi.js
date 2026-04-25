
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const getDocumentStates = () => apiRequest.get(apiMap.backend.v1.documents.states())

export {
  getDocumentStates,
}
