
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { Placement } from '@/enums/Placement'
import { Localization, localize } from '@/localization/i18n'
import { conversationsListItemShape } from '@/models/AgenticChat'
import { ConversationSelector } from '../ConversationSelector'
import { InitialConversationTitleInput } from '../InitialConversationTitleInput'
import {
  Wrapper,
  StartNewChatIcon,
  StartNewChatButton,
  Actions,
} from './ChatHeaderBase.styles'

const CREATE_NEW_CONVERSATION_BUTTON_TEST_ID = 'create-new-conversation-button'

const ChatHeaderBase = ({
  activeConversationId,
  currentDocumentConversations,
  initialTitle,
  onTitleChange,
  onCreateNew,
  disabled,
}) => {
  const handleCreateNew = useCallback((e) => {
    e.stopPropagation()
    onCreateNew()
  }, [onCreateNew])

  return (
    <Wrapper>
      {
        !activeConversationId && (
          <InitialConversationTitleInput
            initialTitle={initialTitle}
            setTitle={onTitleChange}
          />
        )
      }
      <Actions>
        <ConversationSelector
          currentDocumentConversations={currentDocumentConversations}
          disabled={disabled}
        />
        <StartNewChatButton
          data-testid={CREATE_NEW_CONVERSATION_BUTTON_TEST_ID}
          disabled={disabled || !activeConversationId}
          icon={<StartNewChatIcon />}
          onClick={handleCreateNew}
          tooltip={
            {
              title: localize(Localization.AGENTIC_CHAT_CREATE_NEW_CONVERSATION),
              placement: Placement.TOP_LEFT,
            }
          }
        />
      </Actions>
    </Wrapper>
  )
}

ChatHeaderBase.propTypes = {
  activeConversationId: PropTypes.string,
  currentDocumentConversations: PropTypes.arrayOf(conversationsListItemShape).isRequired,
  disabled: PropTypes.bool,
  initialTitle: PropTypes.string.isRequired,
  onCreateNew: PropTypes.func.isRequired,
  onTitleChange: PropTypes.func.isRequired,
}

export {
  ChatHeaderBase,
}
