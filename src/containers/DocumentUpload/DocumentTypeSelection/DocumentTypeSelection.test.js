
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { ENV } from '@/utils/env'
import { render } from '@/utils/rendererRTL'
import { DocumentTypeSelection } from './DocumentTypeSelection'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/requests')

jest.mock('@/containers/DocumentTypesGroupsSelect', () => ({
  DocumentTypesGroupsSelect: ({ onChange }) => (
    <select onChange={() => onChange(mockGroup1)}>
      <option value={mockGroup1.id}>{mockGroup1.name}</option>
      <option value={mockGroup2.id}>{mockGroup2.name}</option>
    </select>
  ),
}))

const mockGroup1 = new DocumentTypesGroup({
  id: 'id1',
  name: 'Group1',
  documentTypeIds: ['code1', 'code2'],
  createdAt: '2012-12-12',
})

const mockGroup2 = new DocumentTypesGroup({
  id: 'id2',
  name: 'Group2',
  documentTypeIds: ['code1', 'code2'],
  createdAt: '2012-11-12',
})

const mockDocumentTypes = [
  new DocumentType(
    'code1',
    'DocumentType1',
  ),
  new DocumentType(
    'code2',
    'DocumentType2',
  ),
]

test('shows selects for document type and types groups correctly', () => {
  const props = {
    selectedGroup: mockGroup1,
    onDocumentTypeChange: jest.fn(),
    onGroupChange: jest.fn(),
    documentTypes: mockDocumentTypes,
  }

  render(<DocumentTypeSelection {...props} />)

  const selects = screen.getAllByRole('combobox')
  const groupLabel = screen.getByText(localize(Localization.DOCUMENT_TYPES_GROUP))
  const documentTypeLabel = screen.getByText(localize(Localization.DOCUMENT_TYPE))

  expect(selects).toHaveLength(2)

  expect(groupLabel).toBeInTheDocument()
  expect(documentTypeLabel).toBeInTheDocument()
})

test('does not render group field if flag FEATURE_DOCUMENT_TYPES_GROUPS is false', () => {
  ENV.FEATURE_DOCUMENT_TYPES_GROUPS = false

  const props = {
    onDocumentTypeChange: jest.fn(),
    onGroupChange: jest.fn(),
    documentTypes: mockDocumentTypes,
  }

  render(<DocumentTypeSelection {...props} />)

  const selects = screen.getAllByRole('combobox')
  const groupLabel = screen.queryByText(localize(Localization.DOCUMENT_TYPES_GROUP))

  expect(selects).toHaveLength(1)
  expect(groupLabel).not.toBeInTheDocument()

  ENV.FEATURE_DOCUMENT_TYPES_GROUPS = true
})

test('calls onDocumentTypeChange prop on select document type', async () => {
  const mockOnDocumentTypeChange = jest.fn()

  const props = {
    selectedGroup: mockGroup1,
    onDocumentTypeChange: mockOnDocumentTypeChange,
    onGroupChange: jest.fn(),
    documentTypes: mockDocumentTypes,
  }

  render(<DocumentTypeSelection {...props} />)

  const [, documentTypeSelect] = screen.getAllByRole('combobox')

  await userEvent.click(documentTypeSelect)

  const [mockDocumentType] = mockDocumentTypes
  const docTypeOption = screen.getByText(mockDocumentType.name)

  await userEvent.click(docTypeOption, {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  expect(mockOnDocumentTypeChange).nthCalledWith(1, mockDocumentType)
})

test('calls onGroupChange and onDocumentTypeChange props on select document types group', async () => {
  const mockOnGroupChange = jest.fn()
  const mockOnDocumentTypeChange = jest.fn()

  const props = {
    selectedGroup: mockGroup1,
    onDocumentTypeChange: mockOnDocumentTypeChange,
    onGroupChange: mockOnGroupChange,
    documentTypes: mockDocumentTypes,
  }

  render(<DocumentTypeSelection {...props} />)

  const [documentTypesGroupSelect] = screen.getAllByRole('combobox')

  await userEvent.selectOptions(documentTypesGroupSelect, mockGroup1.name)

  expect(mockOnGroupChange).nthCalledWith(1, mockGroup1)
  expect(mockOnDocumentTypeChange).nthCalledWith(1, null)
})
