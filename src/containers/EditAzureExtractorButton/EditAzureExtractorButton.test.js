
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import {
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExtractionType } from '@/enums/ExtractionType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { render } from '@/utils/rendererRTL'
import { EditAzureExtractorButton } from './EditAzureExtractorButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

const mockFetchAzureExtractor = jest.fn(() => ({
  unwrap: jest.fn(() => ({})),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  ...jest.requireActual('@/apiRTK/documentTypeApi'),
  useFetchAzureExtractorQuery: jest.fn(() => ([
    mockFetchAzureExtractor,
    { isLoading: false },
  ])),
}))

const mockDocumentType = new DocumentType(
  'DocType',
  'Doc Type',
  null,
  null,
  ExtractionType.AZURE_CLOUD_EXTRACTOR,
)

test('shows button with correct text', async () => {
  render(
    <EditAzureExtractorButton
      documentType={mockDocumentType}
    />,
  )

  const button = screen.getByRole('button', localize(Localization.EDIT))

  await waitFor(() => {
    expect(button).toBeInTheDocument()
  })
})

test('shows Azure Extractor drawer', async () => {
  render(
    <EditAzureExtractorButton
      documentType={mockDocumentType}
    />,
  )

  const editButton = screen.getByRole('button', localize(Localization.EDIT))
  await userEvent.click(editButton)

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
})
