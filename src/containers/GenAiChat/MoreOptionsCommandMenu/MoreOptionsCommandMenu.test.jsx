/* eslint-disable testing-library/no-node-access */

import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { removeChatDialogs } from '@/actions/genAiChat'
import { deleteAiConversation } from '@/api/aiConversationApi'
import { Localization, localize } from '@/localization/i18n'
import { Document } from '@/models/Document'
import { DocumentType } from '@/models/DocumentType'
import { GenAiChatDialog, GenAiChatMessage } from '@/models/GenAiChatDialog'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { MoreOptionsCommandMenu } from './MoreOptionsCommandMenu'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/api/aiConversationApi', () => ({
  deleteAiConversation: jest.fn(),
}))

jest.mock('@/components/Icons/DotsVerticalIcon', () => ({
  DotsVerticalIcon: () => <div data-testid={mockIconId} />,
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
}))

const mockDocumentId = 'mockId'
const mockIconId = 'moreOptionsButtonIconId'
const mockDispatch = jest.fn()

const mockDocument = new Document({
  id: mockDocumentId,
  title: 'title',
  documentType: new DocumentType('code', 'name'),
})

const mockDialog = new GenAiChatDialog({
  id: 'dialogId',
  documentId: mockDocument._id,
  model: 'model',
  provider: 'provider',
  prompt: new GenAiChatMessage('11:12', 'prompt'),
  answer: new GenAiChatMessage('11:12', 'answerItem'),
})

URL.createObjectURL = jest.fn()
URL.revokeObjectURL = jest.fn()

let user

beforeEach(() => {
  jest.useFakeTimers()
  user = userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
  })
})

afterEach(() => {
  jest.useRealTimers()
})

test('render MoreOptionsCommandMenu component correctly', () => {
  const props = {
    disabled: false,
    document: mockDocument,
    dialogs: [mockDialog],
  }

  render(<MoreOptionsCommandMenu {...props} />)

  expect(screen.getByTestId(mockIconId)).toBeInTheDocument()
})

test('render confirmation modal when click on ClearHistory button', async () => {
  const props = {
    disabled: false,
    document: mockDocument,
    dialogs: [mockDialog],
  }

  render(<MoreOptionsCommandMenu {...props} />)

  await user.click(screen.getByTestId(mockIconId))

  const dropdown = document.querySelector('.ant-dropdown')
  dropdown.style = ''

  await user.click(screen.getByRole('button', { name: localize(Localization.CLEAR_HISTORY) }))

  expect(screen.getByText(localize(Localization.CLEAR_AI_CONVERSATION_HISTORY_CONFIRM_MESSAGE))).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: localize(Localization.CANCEL) }))
})

test('close confirmation modal when click on Cancel button', async () => {
  jest.clearAllMocks()

  const props = {
    disabled: false,
    document: mockDocument,
    dialogs: [mockDialog],
  }

  render(<MoreOptionsCommandMenu {...props} />)

  await user.click(screen.getByTestId(mockIconId))

  const dropdown = document.querySelector('.ant-dropdown')
  dropdown.style = ''

  await user.click(screen.getByRole('button', { name: localize(Localization.CLEAR_HISTORY) }))

  expect(screen.getByText(localize(Localization.CLEAR_AI_CONVERSATION_HISTORY_CONFIRM_MESSAGE))).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: localize(Localization.CANCEL) }))

  expect(screen.queryByText(localize(Localization.CLEAR_AI_CONVERSATION_HISTORY_CONFIRM_MESSAGE))).not.toBeInTheDocument()
})

test('calls deleteAiConversation request when click on Delete button in confirmation modal', async () => {
  jest.clearAllMocks()

  const props = {
    disabled: false,
    document: mockDocument,
    dialogs: [mockDialog],
  }

  render(<MoreOptionsCommandMenu {...props} />)

  await user.click(screen.getByTestId(mockIconId))

  const dropdown = document.querySelector('.ant-dropdown')
  dropdown.style = ''

  await user.click(screen.getByRole('button', { name: localize(Localization.CLEAR_HISTORY) }))

  expect(screen.getByText(localize(Localization.CLEAR_AI_CONVERSATION_HISTORY_CONFIRM_MESSAGE))).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: localize(Localization.DELETE) }))

  expect(deleteAiConversation).nthCalledWith(1, mockDocumentId)
})

test('calls dispatch with removeChatDialogs action when click on Delete button in confirmation modal', async () => {
  jest.clearAllMocks()

  const props = {
    disabled: false,
    document: mockDocument,
    dialogs: [mockDialog],
  }

  render(<MoreOptionsCommandMenu {...props} />)

  await user.click(screen.getByTestId(mockIconId))

  const dropdown = document.querySelector('.ant-dropdown')
  dropdown.style = ''

  await user.click(screen.getByRole('button', { name: localize(Localization.CLEAR_HISTORY) }))

  expect(screen.getByText(localize(Localization.CLEAR_AI_CONVERSATION_HISTORY_CONFIRM_MESSAGE))).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: localize(Localization.DELETE) }))

  expect(mockDispatch).nthCalledWith(1, removeChatDialogs(mockDocumentId))
})

test('calls notifyWarning if deleteAiConversation request fails with error', async () => {
  jest.clearAllMocks()

  deleteAiConversation.mockRejectedValueOnce(new Error('test'))

  const props = {
    disabled: false,
    document: mockDocument,
    dialogs: [mockDialog],
  }

  render(<MoreOptionsCommandMenu {...props} />)

  await user.click(screen.getByTestId(mockIconId))

  const dropdown = document.querySelector('.ant-dropdown')
  dropdown.style = ''

  await user.click(screen.getByRole('button', { name: localize(Localization.CLEAR_HISTORY) }))

  expect(screen.getByText(localize(Localization.CLEAR_AI_CONVERSATION_HISTORY_CONFIRM_MESSAGE))).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: localize(Localization.DELETE) }))

  expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR_MESSAGE))
})

test('calls createObjectUrl when click on download button', async () => {
  HTMLAnchorElement.prototype.click = jest.fn()

  const props = {
    disabled: false,
    document: mockDocument,
    dialogs: [mockDialog],
  }

  render(<MoreOptionsCommandMenu {...props} />)

  await user.click(screen.getByTestId(mockIconId))

  const dropdown = document.querySelector('.ant-dropdown')
  dropdown.style = ''

  await user.click(screen.getByText(localize(Localization.DOWNLOAD)))

  expect(URL.createObjectURL).toHaveBeenCalled()
})
