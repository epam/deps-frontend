
import PropTypes from 'prop-types'

class AgenticChatDialogMessage {
  constructor (createdAt, text) {
    this.createdAt = createdAt
    this.text = text
  }
}

class AgenticChatDialog {
  constructor ({
    id,
    conversationId,
    question,
    answer,
  }) {
    this.id = id
    this.conversationId = conversationId
    this.question = question
    this.answer = answer
  }
}

const agenticChatDialogMessageShape = PropTypes.shape({
  createdAt: PropTypes.string.isRequired,
  text: PropTypes.string,
})

const agenticChatDialogShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  conversationId: PropTypes.string.isRequired,
  question: agenticChatDialogMessageShape,
  answer: agenticChatDialogMessageShape,
})

export {
  AgenticChatDialogMessage,
  AgenticChatDialog,
  agenticChatDialogMessageShape,
  agenticChatDialogShape,
}
