
import { createSelector } from 'reselect'
import { idSelector } from '@/selectors/documentReviewPage'

const genAiDataSelector = (state) => state.genAiData

const genAiFieldsSelector = createSelector(
  [genAiDataSelector, idSelector],
  (data, id) => data?.[id] || [],
)

export {
  genAiFieldsSelector,
}
