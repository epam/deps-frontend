
import get from 'lodash/get'
import { createSelector } from 'reselect'

const fileReviewPageStateSelector = (state) => get(state, 'fileReviewPage')

const highlightedFieldSelector = createSelector(
  [fileReviewPageStateSelector],
  (review) => get(review, 'highlightedField'),
)

export {
  fileReviewPageStateSelector,
  highlightedFieldSelector,
}
