
import PropTypes from 'prop-types'
import { agenticChatDialogMessageShape } from './AgenticChatDialog'

class AgenticChatCompletion {
  constructor ({
    id,
    question,
    answer,
  }) {
    this.id = id
    this.question = question
    this.answer = answer
  }
}

const agenticChatCompletionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  question: agenticChatDialogMessageShape,
  answer: agenticChatDialogMessageShape,
})

class AgenticConversation {
  constructor ({
    id,
    title,
    completions,
    relation,
  }) {
    this.id = id
    this.title = title
    this.completions = completions
    this.relation = relation
  }
}

const documentRelationShape = PropTypes.shape({
  documentId: PropTypes.string.isRequired,
})

const agenticConversationShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  completions: PropTypes.arrayOf(
    agenticChatCompletionShape,
  ).isRequired,
  relation: PropTypes.shape({
    details: PropTypes.oneOfType([
      documentRelationShape,
      PropTypes.object,
    ]).isRequired,
  }),
})

export {
  AgenticChatCompletion,
  AgenticConversation,
  agenticChatCompletionShape,
  agenticConversationShape,
}
