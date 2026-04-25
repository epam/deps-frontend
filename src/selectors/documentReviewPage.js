
import get from 'lodash/get'
import { createSelector } from 'reselect'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { documentsRootStateSelector } from '@/selectors/documents'
import { documentTypeStateSelector } from '@/selectors/documentType'

const documentReviewPageStateSelector = (state) => get(state, 'documentReviewPage')

const idSelector = createSelector(
  [documentReviewPageStateSelector],
  (view) => get(view, 'id'),
)

const documentSelector = createSelector(
  [documentsRootStateSelector, idSelector],
  (documents, id) => get(documents, id),
)

const confidenceViewSelector = createSelector(
  [documentReviewPageStateSelector],
  (review) => get(review, 'confidenceView'),
)

const dataSavingSelector = createSelector(
  [documentReviewPageStateSelector],
  (review) => get(review, 'dataSaving'),
)

const tabsSelector = createSelector(
  [documentReviewPageStateSelector],
  (review) => get(review, 'tabs'),
)

const highlightedFieldSelector = createSelector(
  [documentReviewPageStateSelector],
  (review) => get(review, 'highlightedField'),
)

const activeTabSelector = createSelector(
  [tabsSelector],
  (tabs) => get(tabs, 'activeTab'),
)

const fieldsGroupingSelector = createSelector(
  [tabsSelector],
  (tabs) => get(tabs, 'fieldsGrouping'),
)

const documentTypeSelector = createSelector(
  [documentTypeStateSelector, documentSelector],
  (documentType, document) => {
    if (document.documentType.code === UNKNOWN_DOCUMENT_TYPE.code || !documentType) {
      return UNKNOWN_DOCUMENT_TYPE
    }

    return documentType
  },
)

const activePolygonsSelector = createSelector(
  [documentReviewPageStateSelector],
  (review) => get(review, 'activePolygons'),
)

const activeFieldTypesSelector = createSelector(
  [documentReviewPageStateSelector],
  (review) => review.activeFieldTypes,
)

export {
  documentReviewPageStateSelector,
  dataSavingSelector,
  activeTabSelector,
  fieldsGroupingSelector,
  highlightedFieldSelector,
  documentSelector,
  idSelector,
  documentTypeSelector,
  confidenceViewSelector,
  activePolygonsSelector,
  activeFieldTypesSelector,
}
