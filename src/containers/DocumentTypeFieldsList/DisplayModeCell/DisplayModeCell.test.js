
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { render } from '@/utils/rendererRTL'
import { DisplayModeCell } from './DisplayModeCell'

jest.mock('@/utils/env', () => mockEnv)

test('show correct text in case readOnly mode is on but confidential mode is off', () => {
  const mockDocumentTypeField = new DocumentTypeField(
    'MOCK_FIELD_1',
    'MOCK_FIELD_1',
    new DocumentTypeFieldMeta('a', 'q'),
    FieldType.STRING,
    false,
    1,
    'code',
    'pk',
    true,
    false,
  )

  render(<DisplayModeCell field={mockDocumentTypeField} />)

  expect(screen.getByText(/read-only mode/i)).toBeInTheDocument()
})

test('show correct text in case confidential mode is enabled', () => {
  const mockDocumentTypeField = new DocumentTypeField(
    'MOCK_FIELD_1',
    'MOCK_FIELD_1',
    new DocumentTypeFieldMeta(),
    FieldType.STRING,
    false,
    1,
    'code',
    'pk',
    true,
    true,
  )

  render(<DisplayModeCell field={mockDocumentTypeField} />)

  expect(screen.getByText(/mask mode/i)).toBeInTheDocument()
})

test('render nothing in case readOnly and confidential modes are off', () => {
  const mockDocumentTypeField = new DocumentTypeField(
    'MOCK_FIELD_1',
    'MOCK_FIELD_1',
    new DocumentTypeFieldMeta(),
    FieldType.STRING,
    false,
    1,
    'code',
    'pk',
    false,
    false,
  )

  const { container } = render(<DisplayModeCell field={mockDocumentTypeField} />)

  expect(container).toBeEmptyDOMElement()
})
