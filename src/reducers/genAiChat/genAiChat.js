
import { handleActions } from 'redux-actions'
import {
  storeChatDialog,
  storeChatDialogs,
  updateDialogAnswer,
  removeChatDialogs,
  removeChatMessages,
} from '@/actions/genAiChat'

const initialState = {}

const genAiChatReducer = handleActions(
  new Map([
    [
      storeChatDialogs,
      (state, { payload: dialogs }) => {
        const [dialog] = dialogs
        const { documentId } = dialog
        const currentConversations = state[documentId] ?? []

        return ({
          ...state,
          [documentId]: [
            ...currentConversations,
            ...dialogs,
          ],
        })
      },
    ],
    [
      storeChatDialog,
      (state, { payload: dialog }) => {
        const { documentId } = dialog
        const currentConversations = state[documentId] ?? []

        return ({
          ...state,
          [documentId]: [
            ...currentConversations,
            dialog,
          ],
        })
      },
    ],
    [
      updateDialogAnswer,
      (state, { payload: { documentId, dialogId, answer } }) => ({
        ...state,
        [documentId]: state[documentId].map((dialog) =>
          dialog.id === dialogId
            ? {
              ...dialog,
              answer,
            }
            : dialog,
        ),

      }),
    ],
    [
      removeChatDialogs,
      (state, { payload: documentId }) => ({
        ...state,
        [documentId]: [],
      }),
    ],
    [
      removeChatMessages,
      (state, { payload: { documentId, messageId } }) => ({
        ...state,
        [documentId]: state[documentId].filter(
          (dialog) => dialog.id !== messageId,
        ),
      }),
    ],
  ]),
  initialState,
)

export {
  genAiChatReducer,
}
