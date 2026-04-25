
import PropTypes from 'prop-types'

class AICompletion {
  constructor ({
    code,
    model,
    provider,
    question,
    response,
    createdAt,
  }) {
    this.code = code
    this.model = model
    this.provider = provider
    this.question = question
    this.response = response
    this.createdAt = createdAt
  }
}

const aiCompletionShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  response: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
})

class AIConversation {
  constructor ({
    entityId,
    userId,
    tenantId,
    completions,
  }) {
    this.entityId = entityId
    this.userId = userId
    this.tenantId = tenantId
    this.completions = completions
  }
}

const aiConversationShape = PropTypes.shape({
  entityId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  tenantId: PropTypes.string.isRequired,
  completions: PropTypes.arrayOf(
    aiCompletionShape,
  ).isRequired,
})

export {
  AICompletion,
  AIConversation,
  aiCompletionShape,
  aiConversationShape,
}
