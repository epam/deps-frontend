
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { renderHook, act } from '@testing-library/react-hooks/dom'
import { updateChatDialog } from '@/actions/agenticChat'
import {
  AgenticChatCompletion,
  AgenticChatDialogMessage,
  AgenticChatDialog,
} from '@/models/AgenticChat'
import { useUpdateQuestion } from './'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('dayjs', () => () => ({
  format: () => mockTime,
}))

jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
  useSelector: jest.fn((selector) => selector),
}))

jest.mock('@/actions/agenticChat', () => ({
  updateChatDialog: jest.fn(() => 'updateChatDialog'),
}))

jest.mock('@/selectors/agenticChat', () => ({
  selectAgenticChatByConversationId: jest.fn(() => mockDialog),
}))

const mockDispatch = jest.fn()
const mockConversationId = 'conversationId'
const mockTime = '11:20'
const dialogPrompt = 'prompt'
const dialogQuestion = new AgenticChatDialogMessage('11:10', dialogPrompt)
const dialogAnswer = new AgenticChatDialogMessage('11:20', 'answer')
const updatedPrompt = 'updated prompt'

const mockCompletion = new AgenticChatCompletion({
  id: 'completionId',
  question: new AgenticChatDialogMessage('11:00', 'question text'),
  answer: new AgenticChatDialogMessage('11:00', 'answer text'),
})

const mockCompletion2 = new AgenticChatCompletion({
  id: 'completionId2',
  question: new AgenticChatDialogMessage('11:00', 'question text - 2'),
  answer: new AgenticChatDialogMessage('11:00', 'answer text - 2'),
})

const mockDialog = [
  new AgenticChatDialog({
    id: mockCompletion.id,
    conversationId: mockConversationId,
    question: dialogQuestion,
    answer: dialogAnswer,
  }),
  new AgenticChatDialog({
    id: mockCompletion2.id,
    conversationId: mockConversationId,
    question: dialogQuestion,
    answer: dialogAnswer,
  }),
]

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns initial state if no edited completion', () => {
  const { result } = renderHook(() => useUpdateQuestion({
    conversationId: mockConversationId,
    editMessage: jest.fn(),
  }))

  expect(result.current.editedCompletionId).toBe(null)
  expect(result.current.updatedQuestion).toBe('')
})

test('saveEditedQuestion dispatches updateChatDialog with correct completions', async () => {
  const { result } = renderHook(() => useUpdateQuestion({
    conversationId: mockConversationId,
    editMessage: jest.fn(),
  }))

  await act(async () => {
    await result.current.setEditingMode(mockCompletion.id, updatedPrompt)
  })

  await act(async () => {
    await result.current.saveEditedQuestion(mockCompletion.id)
  })

  expect(mockDispatch).nthCalledWith(1, updateChatDialog({
    conversationId: mockConversationId,
    completions: [mockCompletion],
  }))
})

test('saveEditedQuestion calls editMessage with correct completion id and updated question', async () => {
  const editMessage = jest.fn()

  const { result } = renderHook(() => useUpdateQuestion({
    conversationId: mockConversationId,
    editMessage,
  }))

  await act(async () => {
    await result.current.setEditingMode(mockCompletion.id, updatedPrompt)
  })

  await act(async () => {
    await result.current.saveEditedQuestion(mockCompletion.id)
  })

  expect(editMessage).nthCalledWith(1, mockCompletion.id, updatedPrompt)
})
