
import PropTypes from 'prop-types'
import { Localization, localize } from '@/localization/i18n'
import { conversationsListItemShape } from '@/models/AgenticChat'
import { ConversationsList } from '../ConversationsList'
import { ConversationsSearch } from '../ConversationsSearch'
import {
  Wrapper,
  NewConversationButton,
  NewConversationIcon,
} from './ConversationsSidebar.styles'

const ConversationsSidebar = ({
  conversations,
  documentsIds,
  fetchConversations,
  hasMore,
  isFetching,
  onStartNewConversation,
}) => (
  <Wrapper>
    <NewConversationButton
      icon={<NewConversationIcon />}
      onClick={onStartNewConversation}
    >
      {localize(Localization.AGENTIC_CHAT_START_NEW_CHAT)}
    </NewConversationButton>
    <ConversationsSearch />
    <ConversationsList
      conversations={conversations}
      documentsIds={documentsIds}
      fetchConversations={fetchConversations}
      hasMore={hasMore}
      isFetching={isFetching}
    />
  </Wrapper>
)

ConversationsSidebar.propTypes = {
  conversations: PropTypes.objectOf(PropTypes.arrayOf(conversationsListItemShape)),
  documentsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchConversations: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  onStartNewConversation: PropTypes.func.isRequired,
}

export {
  ConversationsSidebar,
}
