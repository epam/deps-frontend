
import { mockSelector } from '@/mocks/mockSelector'
import { GenAiChatDialog, GenAiChatMessage } from '@/models/GenAiChatDialog'

const mockDocumentId = 'mockId'

const mockDialog = new GenAiChatDialog({
  id: 'dialogId',
  documentId: mockDocumentId,
  model: 'dial-turbo',
  provider: 'dial',
  prompt: new GenAiChatMessage('11:12', 'prompt'),
  answer: new GenAiChatMessage('11:13', 'answer'),
})

const documentChatDialogsSelector = mockSelector([mockDialog])

export {
  documentChatDialogsSelector,
}
