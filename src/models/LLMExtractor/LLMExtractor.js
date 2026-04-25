
import PropTypes from 'prop-types'
import { llmExtractionParamsShape } from './LLMExtractionParams'
import { llmExtractionQueryShape } from './LLMExtractionQuery'
import { llmReferenceShape } from './LLMReference'

class LLMExtractor {
  constructor ({
    extractorId,
    name,
    extractionParams,
    llmReference,
    queries,
  }) {
    this.extractorId = extractorId
    this.name = name
    this.extractionParams = extractionParams
    this.llmReference = llmReference
    this.queries = queries
  }

  static getQueryByCode = (code, extractor) => (
    extractor.queries.find((query) => query.code === code)
  )

  static getQueryNodesFromExtractor = (code, extractor) => {
    const query = extractor.queries.find((query) => query.code === code)
    return query.workflow.nodes
  }
}

class LLMExtractors {
  constructor ({ extractors }) {
    this.extractors = extractors
  }

  static getExtractorByQueryCode = (code, extractors) => (
    extractors.find((extractor) => (
      extractor.queries.some((query) => query.code === code)
    ))
  )
}

const llmExtractorShape = PropTypes.shape({
  extractorId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  llmReference: llmReferenceShape.isRequired,
  extractionParams: llmExtractionParamsShape.isRequired,
  queries: PropTypes.arrayOf(llmExtractionQueryShape).isRequired,
})

export {
  LLMExtractor,
  llmExtractorShape,
  LLMExtractors,
}
