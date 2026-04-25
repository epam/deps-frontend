
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { LongText } from '@/components/LongText'
import { MoreConversationActions } from '../../MoreConversationActions'
import { ListItem } from './ConversationsListItem.styles'

const isValidRelatedTarget = (event) => event?.relatedTarget && event.relatedTarget !== window

const ConversationsListItem = ({
  conversationId,
  conversationTitle,
  nextConversationId,
  isActive,
  itemRef,
  onAfterDelete,
  selectConversation,
  updateConversationTitle,
}) => {
  const [isMoreActionsVisible, setIsMoreActionsVisible] = useState(false)

  const hideMoreActions = useCallback(() => {
    setIsMoreActionsVisible(false)
  }, [])

  const handleMouseEnter = useCallback((event) => {
    if (!isValidRelatedTarget(event)) return
    setIsMoreActionsVisible(true)
  }, [])

  const handleMouseLeave = useCallback((event) => {
    if (!isValidRelatedTarget(event)) return
    hideMoreActions()
  }, [hideMoreActions])

  const onAfterRename = useCallback((title) => {
    updateConversationTitle(title)
  }, [updateConversationTitle])

  return (
    <ListItem
      ref={itemRef}
      $isActive={isActive}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <LongText
        onClick={selectConversation}
        text={conversationTitle}
      />
      {
        isMoreActionsVisible && (
          <MoreConversationActions
            conversationId={conversationId}
            conversationTitle={conversationTitle}
            hideMoreActions={hideMoreActions}
            isActive={isActive}
            nextConversationId={nextConversationId}
            onAfterDelete={onAfterDelete}
            onAfterRename={onAfterRename}
          />
        )
      }
    </ListItem>
  )
}

ConversationsListItem.propTypes = {
  conversationId: PropTypes.string.isRequired,
  nextConversationId: PropTypes.string,
  conversationTitle: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  itemRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onAfterDelete: PropTypes.func.isRequired,
  selectConversation: PropTypes.func.isRequired,
  updateConversationTitle: PropTypes.func.isRequired,
}

export {
  ConversationsListItem,
}
