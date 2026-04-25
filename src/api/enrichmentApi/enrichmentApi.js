
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const createExtraField = (typeCode, fieldData) => apiRequest.post(apiMap.apiGatewayV2.v5.documentTypes.documentType.extraFields(typeCode), fieldData)

const deleteExtraFields = (typeCode, fieldCodes) => apiRequest.delete(
  apiMap.apiGatewayV2.v5.documentTypes.documentType.extraFields(typeCode, fieldCodes),
)

const updateExtraFields = (typeCode, extraFields) => apiRequest.put(
  apiMap.apiGatewayV2.v5.documentTypes.documentType.extraFields(typeCode),
  { extraFields },
)

export {
  createExtraField,
  deleteExtraFields,
  updateExtraFields,
}
