
import PropTypes from 'prop-types'
import { Conversation } from '../Conversation'
import { useChatSettings } from '../hooks'
import { SuggestedPrompts } from '../SuggestedPrompts'
import { Wrapper } from './ChatContent.styles'

const ChatContent = ({
  containerRef,
  editMessage,
  isCompletionProcessing,
  onSuggestedPromptClick,
}) => {
  const { isExpandedView, activeConversationId } = useChatSettings()

  return (
    <Wrapper $isExpanded={isExpandedView}>
      {
        activeConversationId ? (
          <Conversation
            containerRef={containerRef}
            conversationId={activeConversationId}
            editMessage={editMessage}
            isCompletionProcessing={isCompletionProcessing}
          />
        ) : (
          <SuggestedPrompts onPromptClick={onSuggestedPromptClick} />
        )
      }
    </Wrapper>
  )
}

ChatContent.propTypes = {
  containerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  editMessage: PropTypes.func.isRequired,
  isCompletionProcessing: PropTypes.bool.isRequired,
  onSuggestedPromptClick: PropTypes.func.isRequired,
}

export {
  ChatContent,
}
