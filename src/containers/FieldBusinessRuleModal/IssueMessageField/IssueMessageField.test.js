
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { render } from '@/utils/rendererRTL'
import { IssueMessageField } from './IssueMessageField'

jest.mock('@/utils/env', () => mockEnv)

const mockDocumentTypeFields = [
  new DocumentTypeField(
    'fieldCode1',
    'Field Name 1',
    new DocumentTypeFieldMeta('BC', 'A'),
    FieldType.STRING,
    false,
    1,
    'mockDocumentTypeCode',
    'mockFieldPk1',
  ),
  new DocumentTypeField(
    'fieldCode2',
    'Field Name 2',
    new DocumentTypeFieldMeta('BC', 'A'),
    FieldType.STRING,
    false,
    2,
    'mockDocumentTypeCode',
    'mockFieldPk2',
  ),
]

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders with placeholder and initial value', () => {
  render(
    <IssueMessageField
      mentionFields={mockDocumentTypeFields}
      onChange={jest.fn()}
      value=""
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.ISSUE_MESSAGE_PLACEHOLDER))
  expect(input).toBeInTheDocument()
  expect(input).toHaveValue('')
})

test('calls onChange with typed value', async () => {
  const onChange = jest.fn()
  const mockInputValue = 'val'

  render(
    <IssueMessageField
      mentionFields={mockDocumentTypeFields}
      onChange={onChange}
      value=""
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.ISSUE_MESSAGE_PLACEHOLDER))
  await userEvent.type(input, mockInputValue)

  expect(onChange).toHaveBeenCalled()
  const callArg = onChange.mock.calls.map((args) => args[0]).join('')
  expect(callArg).toBe(mockInputValue)
})
