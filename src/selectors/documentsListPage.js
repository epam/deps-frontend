
import get from 'lodash/get'
import { createSelector } from 'reselect'
import { documentsRootStateSelector } from '@/selectors/documents'

const documentsListPageStateSelector = (state) => get(state, 'documentsListPage')

const documentsTotalSelector = createSelector(
  [documentsListPageStateSelector],
  (list) => get(list, 'total'),
)

const documentsIdsSelector = createSelector(
  [documentsListPageStateSelector],
  (list) => get(list, 'ids'),
)

const documentsSelector = createSelector(
  [documentsRootStateSelector, documentsIdsSelector],
  (documents, ids) => ids.map((id) => documents[id]),
)

export {
  documentsIdsSelector,
  documentsTotalSelector,
  documentsSelector,
}
