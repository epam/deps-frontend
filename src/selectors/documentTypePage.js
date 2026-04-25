
import get from 'lodash/get'
import { createSelector } from 'reselect'

const documentTypePageStateSelector = (state) => get(state, 'documentTypePage')

const activeTabSelector = createSelector(
  [documentTypePageStateSelector],
  (documentTypePage) => get(documentTypePage, 'activeTab'),
)

export {
  activeTabSelector,
}
