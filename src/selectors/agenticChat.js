
import get from 'lodash/get'
import { createSelector } from 'reselect'

const agenticChatSelector = (state) => get(state, 'agenticChat')

const selectAgenticChatByConversationId = (conversationId) => createSelector(
  [agenticChatSelector],
  (conversations) => conversations[conversationId] || [],
)

export {
  agenticChatSelector,
  selectAgenticChatByConversationId,
}
