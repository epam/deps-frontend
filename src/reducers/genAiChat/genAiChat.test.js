
import { mockEnv } from '@/mocks/mockEnv'
import {
  removeChatDialogs,
  storeChatDialog,
  updateDialogAnswer,
} from '@/actions/genAiChat'
import {
  GenAiChatDialog,
  GenAiChatMessage,
} from '@/models/GenAiChatDialog'
import { genAiChatReducer } from './genAiChat'

jest.mock('@/utils/env', () => mockEnv)

const mockAnswer = new GenAiChatMessage('11:11', 'Updated answer')

const mockDialog = new GenAiChatDialog({
  id: 'id',
  documentId: 'documentId',
  prompt: new GenAiChatMessage('11:11', 'prompt'),
  answer: new GenAiChatMessage('11:11', 'answer'),
})

const initialState = {
  [mockDialog.documentId]: [mockDialog],
}

describe('Reducer: genAiChat', () => {
  it('Action handler: storeChatDialog', () => {
    const action = storeChatDialog(mockDialog)

    const expected = {
      [mockDialog.documentId]: [mockDialog],
    }

    expect(genAiChatReducer({}, action)).toEqual(expected)
  })

  it('Action handler: updateDialogAnswer', () => {
    const { id, documentId } = mockDialog
    const action = updateDialogAnswer({
      dialogId: id,
      documentId,
      answer: mockAnswer,
    })

    const expected = {
      [mockDialog.documentId]: [{
        ...mockDialog,
        answer: mockAnswer,
      }],
    }

    expect(genAiChatReducer(initialState, action)).toEqual(expected)
  })

  it('Action handler: removeChatDialog', () => {
    const action = removeChatDialogs(mockDialog.documentId)

    const expected = {
      [mockDialog.documentId]: [],
    }

    expect(genAiChatReducer(initialState, action)).toEqual(expected)
  })
})
