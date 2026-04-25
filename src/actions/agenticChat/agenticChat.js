
import { createAction } from 'redux-actions'

export const FEATURE_NAME = 'AGENTIC_CHAT'

export const removeChatDialogs = createAction(
  `${FEATURE_NAME}/REMOVE_CHAT_DIALOGS`,
)

export const storeChatDialogs = createAction(
  `${FEATURE_NAME}/STORE_CHAT_DIALOGS`,
)

export const storeChatDialog = createAction(
  `${FEATURE_NAME}/STORE_CHAT_DIALOG`,
)

export const updateChatDialog = createAction(
  `${FEATURE_NAME}/UPDATE_CHAT_DIALOG`,
)
