
import PropTypes from 'prop-types'

class GenAiChatMessage {
  constructor (time, message) {
    this.time = time
    this.message = message
  }
}

class GenAiChatDialog {
  constructor ({
    id,
    documentId,
    prompt,
    answer,
    model,
    provider,
  }) {
    this.id = id
    this.documentId = documentId
    this.prompt = prompt
    this.answer = answer
    this.model = model
    this.provider = provider
  }
}

const genAiChatMessageShape = PropTypes.shape({
  time: PropTypes.string.isRequired,
  message: PropTypes.string,
})

const genAiChatDialogShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  prompt: genAiChatMessageShape.isRequired,
  answer: genAiChatMessageShape,
  model: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
})

export {
  GenAiChatMessage,
  GenAiChatDialog,
  genAiChatMessageShape,
  genAiChatDialogShape,
}
