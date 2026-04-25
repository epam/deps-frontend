
import get from 'lodash/get'
import { createSelector } from 'reselect'
import { documentTypesStateSelector } from '@/selectors/documentTypes'

const documentTypesListPageStateSelector = (state) => get(state, 'documentTypesListPage')

const documentsListIdsSelector = createSelector(
  [documentTypesListPageStateSelector],
  (list) => get(list, 'ids', []),
)

const documentTypesSelector = createSelector(
  [documentTypesStateSelector, documentsListIdsSelector],
  (documentTypes, ids) => ids
    .map((id) => documentTypes[id])
    .sort((prev, current) => prev.name.localeCompare(current.name, undefined, { caseFirst: 'upper' })),
)

export {
  documentTypesSelector,
}
