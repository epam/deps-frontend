
import PropTypes from 'prop-types'
import { ChatInput } from '../ChatInput'
import { ConversationSettings } from '../ConversationSettings'
import { useChatSettings } from '../hooks'
import { Wrapper } from './ChatFooter.styles'

const ChatFooter = ({
  disabled,
  prompt,
  onSendMessage,
  setPrompt,
}) => {
  const { isExpandedView } = useChatSettings()

  return (
    <Wrapper $isExpanded={isExpandedView}>
      <ConversationSettings disabled={disabled} />
      <ChatInput
        disabled={disabled}
        prompt={prompt}
        saveDialog={onSendMessage}
        setPrompt={setPrompt}
      />
    </Wrapper>
  )
}

ChatFooter.propTypes = {
  disabled: PropTypes.bool.isRequired,
  prompt: PropTypes.string.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  setPrompt: PropTypes.func.isRequired,
}

export {
  ChatFooter,
}
