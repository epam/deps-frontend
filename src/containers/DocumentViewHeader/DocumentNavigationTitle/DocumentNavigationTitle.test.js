
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { updateDocument } from '@/actions/documentReviewPage'
import { documentSelector } from '@/selectors/documentReviewPage'
import { removeFileExtension } from '@/utils/file'
import { getFileExtension } from '@/utils/getFileExtension'
import { render } from '@/utils/rendererRTL'
import { DocumentNavigationTitle } from './DocumentNavigationTitle'

const mockAction = { type: 'action' }

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/requests')

const editIconTestId = 'edit-icon'
const submitIconTestId = 'submit-icon'
const statusTestId = 'document-status'

jest.mock('@/containers/DocumentStatus', () => ({
  DocumentStatus: () => <div data-testid={statusTestId} />,
}))

jest.mock('@/components/Icons/PenIcon', () => ({
  PenIcon: () => <div data-testid={editIconTestId} />,
}))

jest.mock('@/components/Icons/CheckIcon', () => ({
  CheckIcon: () => <div data-testid={submitIconTestId} />,
}))

jest.mock('@/actions/documentReviewPage', () => ({
  updateDocument: jest.fn(() => mockAction),
}))

const document = documentSelector.getSelectorMockValue()
const extension = getFileExtension(document.title)
const titleWithoutExtension = removeFileExtension(document.title)

test('shows document title, document state, document type and change document title button', async () => {
  render(<DocumentNavigationTitle />)

  expect(screen.getByText(document.title)).toBeInTheDocument()
  expect(screen.getByText(document.documentType.name)).toBeInTheDocument()
  expect(screen.getByTestId(editIconTestId)).toBeInTheDocument()
  expect(screen.getByTestId(statusTestId)).toBeInTheDocument()
})

test('updates title if user changes the title', async () => {
  render(<DocumentNavigationTitle />)

  const editButton = screen.getByTestId(editIconTestId)

  await userEvent.click(editButton)

  const titleInput = screen.getByDisplayValue(titleWithoutExtension)

  const mockNewTitle = '1'

  await userEvent.type(titleInput, mockNewTitle)
  await userEvent.click(screen.getByTestId(submitIconTestId))

  expect(updateDocument).nthCalledWith(
    1,
    {
      title: `${titleWithoutExtension}${mockNewTitle}${extension}`,
    },
    document._id,
  )
})

test('does not update title if changed title is the same as existing', async () => {
  jest.clearAllMocks()

  render(<DocumentNavigationTitle />)

  const editButton = screen.getByTestId(editIconTestId)

  await userEvent.click(editButton)

  const titleInput = screen.getByDisplayValue(titleWithoutExtension)

  await userEvent.type(titleInput, titleWithoutExtension)

  expect(updateDocument).not.toHaveBeenCalled()
})
