
import PropTypes from 'prop-types'
import { ReviewPolicy } from '@/enums/ReviewPolicy'

class WorkflowConfiguration {
  constructor ({
    parsingFeatures = [],
    needsPostprocessing = false,
    needsExtraction = false,
    needsValidation = false,
    needsReview = ReviewPolicy.ALWAYS_REVIEW,
    needsOutputExporting = false,
  } = {}) {
    this.parsingFeatures = parsingFeatures
    this.needsPostprocessing = needsPostprocessing
    this.needsExtraction = needsExtraction
    this.needsValidation = needsValidation
    this.needsReview = needsReview
    this.needsOutputExporting = needsOutputExporting
  }
}

const workflowConfigurationShape = PropTypes.shape({
  parsingFeatures: PropTypes.arrayOf(PropTypes.string),
  needsPostprocessing: PropTypes.bool,
  needsExtraction: PropTypes.bool,
  needsValidation: PropTypes.bool,
  needsReview: PropTypes.oneOf(Object.values(ReviewPolicy)),
  needsOutputExporting: PropTypes.bool,
})

export {
  WorkflowConfiguration,
  workflowConfigurationShape,
}
