
import get from 'lodash/get'
import { createSelector } from 'reselect'

const systemBuildSelector = (state) => get(state, 'system')

const buildDateSelector = createSelector(
  [systemBuildSelector],
  (build) => get(build, 'buildDate') || '',
)

const commitHashSelector = createSelector(
  [systemBuildSelector],
  (build) => get(build, 'commitHash') || '',
)

const tableColumnsSelector = createSelector(
  [systemBuildSelector],
  (build) => get(build, 'tableColumns'),
)

export {
  buildDateSelector,
  commitHashSelector,
  tableColumnsSelector,
  systemBuildSelector,
}
