
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const getBuildVersion = async () => apiRequest.get(apiMap.backend.v1.version())

const getTableColumns = () => JSON.parse(window.localStorage.getItem('tableColumns'))

const saveTableColumns = (columns) => window.localStorage.setItem('tableColumns', JSON.stringify(columns))

export {
  getBuildVersion,
  getTableColumns,
  saveTableColumns,
}
