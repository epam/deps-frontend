
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { goTo } from '@/actions/navigation'
import { Localization, localize } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { render } from '@/utils/rendererRTL'
import { ReadOnlyViewHeader } from './ReadOnlyViewHeader'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(() => 'goTo'),
}))

jest.mock('@/components/Icons/WarningTriangleIcon', () => ({
  WarningTriangleIcon: () => <span data-testid='warning-icon' />,
}))

jest.mock('@/components/LongText', () => ({
  LongText: jest.fn(({ text }) => text),
}))

const mockCloseModal = jest.fn()
const mockDispatch = jest.fn()
const mockDocumentData = {
  documentId: 'docId',
  title: 'Document title',
}

jest.mock('../hooks', () => ({
  useChatSettings: jest.fn(() => ({
    activeDocumentData: mockDocumentData,
    closeModal: mockCloseModal,
  })),
}))

test('renders header with correct layout', () => {
  render(<ReadOnlyViewHeader />)

  expect(screen.getByTestId('warning-icon')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.AGENTIC_CHAT_READONLY_MESSAGE))).toBeInTheDocument()
  expect(screen.getByRole('button', { name: mockDocumentData.title })).toBeInTheDocument()
})

test('should call onClick when click on document title button', async () => {
  render(<ReadOnlyViewHeader />)

  const button = screen.getByRole('button', { name: mockDocumentData.title })
  await userEvent.click(button)

  expect(mockCloseModal).toHaveBeenCalled()
})

test('should call goTo action when click on document title button', async () => {
  render(<ReadOnlyViewHeader />)

  const button = screen.getByRole('button', { name: mockDocumentData.title })
  await userEvent.click(button)

  expect(mockDispatch).nthCalledWith(1, goTo())
  expect(goTo).nthCalledWith(
    1,
    navigationMap.documents.document(mockDocumentData.documentId),
  )
})
