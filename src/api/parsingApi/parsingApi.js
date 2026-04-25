
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const getTabularLayout = (documentId, config) => (
  apiRequest.get(apiMap.apiGatewayV2.v5.documents.document.tabularLayout(documentId, config))
)

const getFileTabularLayout = (fileId, config) => (
  apiRequest.get(apiMap.apiGatewayV2.v5.files.file.tabularLayout(fileId, config))
)

export {
  getTabularLayout,
  getFileTabularLayout,
}
