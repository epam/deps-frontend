
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const getEngines = () => apiRequest.get(apiMap.apiGatewayV2.v5.tools.ocr.engines())

const getTableEngines = () => apiRequest.get(apiMap.tables.v1.tableEngines())

export {
  getEngines,
  getTableEngines,
}
