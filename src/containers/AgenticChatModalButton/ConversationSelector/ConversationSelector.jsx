
import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { Dropdown } from '@/components/Dropdown'
import { MenuTrigger } from '@/components/Menu'
import { Localization, localize } from '@/localization/i18n'
import { conversationsListItemShape } from '@/models/AgenticChat'
import { useChatSettings } from '../hooks'
import {
  DropdownTrigger,
  ItemTitle,
  StyledMenu,
  StyledMenuItem,
  ConversationsIcon,
  ConversationsButtonIcon,
} from './ConversationSelector.styles'

const SWITCH_CONVERSATIONS_BUTTON_TEST_ID = 'switch-conversations-button'

const ConversationSelector = ({
  currentDocumentConversations,
  disabled,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { activeConversationId, setActiveConversationId } = useChatSettings()

  const activeConversation = useMemo(
    () => {
      if (!activeConversationId) {
        return null
      }

      return currentDocumentConversations.find(({ id }) => id === activeConversationId)
    },
    [activeConversationId, currentDocumentConversations],
  )

  const handleDropdownVisibleChange = useCallback((open) => {
    setIsDropdownOpen(open)
  }, [])

  const handleConversationSelect = useCallback((conversationId) => {
    setActiveConversationId(conversationId)
    setIsDropdownOpen(false)
  }, [setActiveConversationId])

  const menu = useMemo(() => (
    <StyledMenu>
      {
        currentDocumentConversations.map((conversation) => (
          <StyledMenuItem
            key={conversation.id}
            $isActive={conversation.id === activeConversation?.id}
            eventKey={conversation.id}
            onClick={() => handleConversationSelect(conversation.id)}
          >
            <ItemTitle text={conversation.title} />
          </StyledMenuItem>
        ))
      }
    </StyledMenu>
  ), [
    activeConversation?.id,
    currentDocumentConversations,
    handleConversationSelect,
  ])

  return (
    <Dropdown
      disabled={disabled || !currentDocumentConversations.length}
      dropdownRender={() => menu}
      onOpenChange={handleDropdownVisibleChange}
      open={isDropdownOpen}
      trigger={MenuTrigger.CLICK}
    >
      {
        activeConversation
          ? (
            <DropdownTrigger
              isActive={isDropdownOpen}
              title={<ItemTitle text={activeConversation.title} />}
            />
          )
          : (
            <ConversationsButtonIcon
              data-testid={SWITCH_CONVERSATIONS_BUTTON_TEST_ID}
              icon={<ConversationsIcon />}
              tooltip={
                {
                  title: localize(Localization.AGENTIC_CHAT_SWITCH_CONVERSATION),
                }
              }
            />
          )
      }
    </Dropdown>
  )
}

ConversationSelector.propTypes = {
  currentDocumentConversations: PropTypes.arrayOf(conversationsListItemShape).isRequired,
  disabled: PropTypes.bool,
}

export {
  ConversationSelector,
}
