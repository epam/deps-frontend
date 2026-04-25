
import { handleActions } from 'redux-actions'
import {
  removeChatDialogs,
  storeChatDialog,
  storeChatDialogs,
  updateChatDialog,
} from '@/actions/agenticChat'

const initialState = {}

const agenticChatReducer = handleActions(
  new Map([
    [
      storeChatDialogs,
      (state, { payload: dialogs }) => {
        const [dialog] = dialogs
        const { conversationId } = dialog

        return ({
          ...state,
          [conversationId]: dialogs,
        })
      },
    ],
    [
      storeChatDialog,
      (state, { payload: dialog }) => {
        const { conversationId } = dialog
        const currentConversations = state[conversationId] ?? []

        return ({
          ...state,
          [conversationId]: [
            ...currentConversations,
            dialog,
          ],
        })
      },
    ],
    [
      updateChatDialog,
      (state, { payload: { conversationId, completions } }) => ({
        ...state,
        [conversationId]: completions,
      }),
    ],
    [
      removeChatDialogs,
      (state, { payload: conversationId }) => ({
        ...state,
        [conversationId]: [],
      }),
    ],
  ]),

  initialState,
)

export {
  agenticChatReducer,
}
