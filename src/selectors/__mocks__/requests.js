
import { mockSelector } from '@/mocks/mockSelector'

const areLanguagesFetchingSelector = mockSelector(false)

const areLabelsFetchingSelector = mockSelector(false)
const areEnginesFetchingSelector = mockSelector(false)
const areDocumentStatesFetchingSelector = mockSelector(false)
const areDocumentsFetchingSelector = mockSelector(false)
const areDocumentsTypeUpdatingSelector = mockSelector(false)
const areDocumentsDataExtractingSelector = mockSelector(false)
const areDocumentsReviewStartingSelector = mockSelector(false)
const areDocumentsDeletingSelector = mockSelector(false)
const isLabelAddingSelector = mockSelector(false)
const isLabelCreatingSelector = mockSelector(false)
const isLabelDeletingSelector = mockSelector(false)
const areTypesFetchingSelector = mockSelector(false)

const isDocumentErrorGettingSelector = mockSelector(false)
const isDocumentDataFetchingSelector = mockSelector(false)
const isDocumentSavingSelector = mockSelector(false)
const isReviewStartingSelector = mockSelector(false)
const isReviewCompletingSelector = mockSelector(false)
const isPipelineRunningSelector = mockSelector(false)
const isDocumentTypeFetchingSelector = mockSelector(false)
const isDocumentTypeUpdatingSelector = mockSelector(false)
const isDataExtractingSelector = mockSelector(false)
const isDocumentValidationSkippingSelector = mockSelector(false)
const isTableDataDetectingSelector = mockSelector(false)
const isAreaExtractingSelector = mockSelector(false)
const isAreaExtractingWithAlgorithmSelector = mockSelector(false)
const isExtractedDataFieldSavingSelector = mockSelector(false)

const areWaitingForApprovalUsersFetchingSelector = mockSelector(false)

const isTrialLimitationsInfoFetchingSelector = mockSelector(false)
const areGenAiFieldsFetchingSelector = mockSelector(false)
const areGenAiFieldsDeletingSelector = mockSelector(false)

export {
  areLanguagesFetchingSelector,
  areLabelsFetchingSelector,
  areEnginesFetchingSelector,
  areDocumentStatesFetchingSelector,
  areTypesFetchingSelector,
  areDocumentsFetchingSelector,
  areDocumentsTypeUpdatingSelector,
  areDocumentsDataExtractingSelector,
  areDocumentsReviewStartingSelector,
  areDocumentsDeletingSelector,
  isLabelAddingSelector,
  isLabelCreatingSelector,
  isLabelDeletingSelector,
  isDocumentDataFetchingSelector,
  isDocumentSavingSelector,
  isReviewCompletingSelector,
  isReviewStartingSelector,
  isPipelineRunningSelector,
  isDocumentTypeUpdatingSelector,
  isDocumentTypeFetchingSelector,
  isDataExtractingSelector,
  isDocumentValidationSkippingSelector,
  isTableDataDetectingSelector,
  isAreaExtractingSelector,
  isAreaExtractingWithAlgorithmSelector,
  areWaitingForApprovalUsersFetchingSelector,
  isDocumentErrorGettingSelector,
  isExtractedDataFieldSavingSelector,
  isTrialLimitationsInfoFetchingSelector,
  areGenAiFieldsFetchingSelector,
  areGenAiFieldsDeletingSelector,
}
