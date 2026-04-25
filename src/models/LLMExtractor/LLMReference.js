
import PropTypes from 'prop-types'

class LLMReference {
  constructor ({
    provider,
    model,
  }) {
    this.provider = provider
    this.model = model
  }
}

const llmReferenceShape = PropTypes.shape({
  provider: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
})

export {
  LLMReference,
  llmReferenceShape,
}
