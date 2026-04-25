
import { createAction } from 'redux-actions'

export const FEATURE_NAME = 'GEN_AI_CHAT'

export const storeChatDialogs = createAction(
  `${FEATURE_NAME}/STORE_CHAT_DIALOGS`,
)

export const storeChatDialog = createAction(
  `${FEATURE_NAME}/STORE_CHAT_DIALOG`,
)

export const updateDialogAnswer = createAction(
  `${FEATURE_NAME}/UPDATE_DIALOG_ANSWER`,
)

export const removeChatDialogs = createAction(
  `${FEATURE_NAME}/REMOVE_CHAT_DIALOGS`,
)

export const removeChatMessages = createAction(
  `${FEATURE_NAME}/REMOVE_CHAT_MESSAGES`,
)
