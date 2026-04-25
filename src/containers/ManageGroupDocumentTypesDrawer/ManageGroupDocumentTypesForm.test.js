
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/dom'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { render } from '@/utils/rendererRTL'
import { ManageGroupDocumentTypesForm } from './ManageGroupDocumentTypesForm'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => mockReactHookForm)

const MAX_TAGS_COUNT = 10

const mockDocumentTypes = Array(MAX_TAGS_COUNT + 1)
  .fill()
  .map((item, i) =>
    new DocumentType(
      `docTypeCode${i}`,
      `DocumentType${i}`,
    ),
  )

test('renders form layout correctly', () => {
  render(
    <ManageGroupDocumentTypesForm
      documentTypes={mockDocumentTypes}
    />,
  )

  expect(screen.getByText(localize(Localization.DOCUMENT_TYPES))).toBeInTheDocument()
  expect(screen.getByRole('combobox')).toBeInTheDocument()
})

test('renders count tag with the value of hidden tags if selected doc types are more then max tags count', async () => {
  const selectedDocumentTypeCodes = mockDocumentTypes.map((docType) => docType.code)

  mockReactHookForm.useController.mockReturnValueOnce({
    field: {
      onChange: jest.fn(),
      value: selectedDocumentTypeCodes,
    },
    fieldState: {},
  })

  render(
    <ManageGroupDocumentTypesForm
      documentTypes={mockDocumentTypes}
    />,
  )

  expect(screen.getByText(
    `+ ${mockDocumentTypes.length - MAX_TAGS_COUNT}`,
  )).toBeInTheDocument()
})
