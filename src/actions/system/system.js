
import { createAction } from 'redux-actions'
import { createRequestAction } from '@/actions/requests'
import { systemApi } from '@/api/systemApi'

const FEATURE_NAME = 'SYSTEM'

const storeSystemVersion = createAction(
  `${FEATURE_NAME}/VERSION_STORE`,
)

const storeTableColumns = createAction(
  `${FEATURE_NAME}/STORE_TABLE_COLUMNS`,
)

const fetchBuildVersion = createRequestAction(
  'fetchBuildVersion',
  () => async (dispatch) => {
    const version = await systemApi.getBuildVersion()
    dispatch(storeSystemVersion(version))
  },
)

const fetchTableColumns = createRequestAction(
  'fetchTableColumns',
  () => async (dispatch) => {
    const columns = systemApi.getTableColumns()
    dispatch(storeTableColumns(columns))
  },
)

const saveTableColumns = createRequestAction(
  'saveTableColumns',
  (columns) => async (dispatch) => {
    systemApi.saveTableColumns(columns)
    dispatch(storeTableColumns(columns))
  },
)

export {
  storeSystemVersion,
  storeTableColumns,
  fetchBuildVersion,
  fetchTableColumns,
  saveTableColumns,
}
