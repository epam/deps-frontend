
import get from 'lodash/get'
import { createSelector } from 'reselect'
import { documentSelector } from './documentReviewPage'

const genAiChatSelector = (state) => get(state, 'genAiChat')

const documentChatDialogsSelector = createSelector(
  [genAiChatSelector, documentSelector],
  (genAiChat, document) => genAiChat[document._id] ?? [],
)

export {
  documentChatDialogsSelector,
}
