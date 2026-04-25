
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const getAvailableLanguages = async () => apiRequest.get(apiMap.apiGatewayV2.v5.tools.ocr.languages())

export {
  getAvailableLanguages,
}
