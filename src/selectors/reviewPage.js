
import { createSelector } from 'reselect'
import { documentReviewPageStateSelector } from '@/selectors/documentReviewPage'
import { fileReviewPageStateSelector } from '@/selectors/fileReviewPage'

const highlightedFieldSelector = createSelector(
  [fileReviewPageStateSelector, documentReviewPageStateSelector],
  (fileReview, documentReview) =>
    fileReview?.highlightedField ?? documentReview?.highlightedField,
)

const activePolygonsSelector = createSelector(
  [fileReviewPageStateSelector, documentReviewPageStateSelector],
  (fileReview, documentReview) => {
    if (fileReview?.activePolygons?.length) {
      return fileReview.activePolygons
    }
    return documentReview?.activePolygons ?? []
  },
)

export {
  highlightedFieldSelector,
  activePolygonsSelector,
}
