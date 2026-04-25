
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { DeleteDocumentTypeExtractorButton } from './DeleteDocumentTypeExtractorButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

const mockDeleteDocumentTypeExtractor = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useDeleteDocumentTypeExtractorMutation: jest.fn(() => [mockDeleteDocumentTypeExtractor]),
}))

Modal.confirm = jest.fn()

const mockRenderTrigger = (onClick) => (
  <button
    data-testid={'delete-trigger'}
    onClick={onClick}
  />
)

const mockDocumentTypeId = 'docTypeId'
const mockExtractorId = 'extractorId'
const mockExtractorName = 'Extractor Name'

test('renders trigger correctly', async () => {
  render(
    <DeleteDocumentTypeExtractorButton
      documentTypeId={mockDocumentTypeId}
      extractorId={mockExtractorId}
      extractorName={mockExtractorName}
      onAfterDelete={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  expect(screen.getByTestId('delete-trigger')).toBeInTheDocument()
})

test('calls Modal.confirm with correct arguments in case of button click', async () => {
  render(
    <DeleteDocumentTypeExtractorButton
      documentTypeId={mockDocumentTypeId}
      extractorId={mockExtractorId}
      extractorName={mockExtractorName}
      onAfterDelete={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(Modal.confirm).nthCalledWith(1, {
    title: localize(Localization.DELETE_CONFIRM_MESSAGE, { name: mockExtractorName }),
    onOk: expect.any(Function),
  })
})

test('calls deleteDocumentTypeExtractor with correct argument when clicking on modal confirm', async () => {
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(
    <DeleteDocumentTypeExtractorButton
      documentTypeId={mockDocumentTypeId}
      extractorId={mockExtractorId}
      extractorName={mockExtractorName}
      onAfterDelete={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockDeleteDocumentTypeExtractor).nthCalledWith(
    1,
    {
      documentTypeId: mockDocumentTypeId,
      extractorId: mockExtractorId,
    },
  )
})

test('calls notifySuccess with correct message in case successful deletion', async () => {
  jest.clearAllMocks()

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(
    <DeleteDocumentTypeExtractorButton
      documentTypeId={mockDocumentTypeId}
      extractorId={mockExtractorId}
      extractorName={mockExtractorName}
      onAfterDelete={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockNotification.notifySuccess).nthCalledWith(
    1,
    localize(Localization.DELETE_SUCCESS, { name: mockExtractorName }),
  )
})

test('calls notifyWarning with correct message in case of delete rejection', async () => {
  jest.clearAllMocks()

  const mockError = new Error('test')
  mockDeleteDocumentTypeExtractor.mockImplementationOnce(() => ({
    unwrap: () => Promise.reject(mockError),
  }))

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(
    <DeleteDocumentTypeExtractorButton
      documentTypeId={mockDocumentTypeId}
      extractorId={mockExtractorId}
      extractorName={mockExtractorName}
      onAfterDelete={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})

it('calls onAfterDelete after success deletion', async () => {
  const mockOnAfterDelete = jest.fn()
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(
    <DeleteDocumentTypeExtractorButton
      documentTypeId={mockDocumentTypeId}
      extractorId={mockExtractorId}
      extractorName={mockExtractorName}
      onAfterDelete={mockOnAfterDelete}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockOnAfterDelete).toHaveBeenCalledTimes(1)
})
