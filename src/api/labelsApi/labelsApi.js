
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const getLabels = () => apiRequest.get(apiMap.apiGatewayV2.v5.documents.labels())

const createLabel = (labelName) => apiRequest.post(apiMap.apiGatewayV2.v5.documents.labels(), {
  labelName,
})

export {
  getLabels,
  createLabel,
}
