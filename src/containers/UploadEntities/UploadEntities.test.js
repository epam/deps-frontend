
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { UploadEntities } from './UploadEntities'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/ManageBatch/AddBatchDrawer', () => ({
  AddBatchDrawer: jest.fn(() => <div data-testid={mockAddBatchDrawerId}>AddBatchDrawer</div>),
}))

jest.mock('@/containers/UploadFilesDrawer', () => ({
  UploadFilesDrawer: jest.fn(() => <div data-testid={mockUploadFilesDrawerId}>UploadFilesDrawer</div>),
}))

jest.mock('@/containers/UploadDocumentsDrawer', () => ({
  UploadDocumentsDrawer: jest.fn(() => <div data-testid={mockUploadDocumentsDrawerId}>UploadDocumentsDrawer</div>),
}))

jest.mock('@/containers/UploadSplittingFilesDrawer', () => ({
  UploadSplittingFilesDrawer: jest.fn(() => <div data-testid={mockUploadSplittingFilesDrawerId}>UploadSplittingFilesDrawer</div>),
}))

const mockAddBatchDrawerId = 'add-batch-drawer'
const mockUploadFilesDrawerId = 'upload-files-drawer'
const mockUploadDocumentsDrawerId = 'upload-documents-drawer'
const mockUploadSplittingFilesDrawerId = 'upload-splitting-files-drawer'

test('renders trigger button', () => {
  render(<UploadEntities />)

  const trigger = screen.getByRole('button', {
    name: localize(Localization.UPLOAD_FILES),
  })

  expect(trigger).toBeInTheDocument()
})

test('opens popover when click on trigger button', async () => {
  render(<UploadEntities />)

  const trigger = screen.getByRole('button', {
    name: localize(Localization.UPLOAD_FILES),
  })

  await userEvent.click(trigger)

  const title = screen.getByText(localize(Localization.TYPE_OF_UPLOAD))

  expect(title).toBeInTheDocument()
})

test('renders all upload options with default mock ENV values', async () => {
  render(<UploadEntities />)

  const trigger = screen.getByRole('button', {
    name: localize(Localization.UPLOAD_FILES),
  })

  await userEvent.click(trigger)

  expect(screen.getByText(localize(Localization.UPLOAD_TYPE_FILE_TITLE))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.DOCUMENT))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.UPLOAD_TYPE_BATCH_TITLE))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.UPLOAD_TYPE_SPLITTING_FILE_TITLE))).toBeInTheDocument()
})

test('renders all upload option descriptions', async () => {
  render(<UploadEntities />)

  const trigger = screen.getByRole('button', {
    name: localize(Localization.UPLOAD_FILES),
  })

  await userEvent.click(trigger)

  expect(screen.getByText(localize(Localization.UPLOAD_TYPE_FILE_DESCRIPTION))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.UPLOAD_TYPE_DOCUMENT_DESCRIPTION))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.UPLOAD_TYPE_BATCH_DESCRIPTION))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.UPLOAD_TYPE_SPLITTING_FILE_DESCRIPTION))).toBeInTheDocument()
})

test('renders selected drawer when click on item in options list', async () => {
  jest.clearAllMocks()

  render(<UploadEntities />)

  const trigger = screen.getByRole('button', {
    name: localize(Localization.UPLOAD_FILES),
  })

  await userEvent.click(trigger)

  const firstOption = screen.getByText(localize(Localization.UPLOAD_TYPE_FILE_TITLE))

  await userEvent.click(firstOption, { pointerEventsCheck: PointerEventsCheckLevel.Never })

  const uploadFilesDrawer = screen.getByTestId(mockUploadFilesDrawerId)

  expect(uploadFilesDrawer).toBeInTheDocument()
})
