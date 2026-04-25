
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { REQUIRED_FIELD_MARKER } from '@/containers/GenAIDrivenFieldModal/constants'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DictFieldMeta, DocumentTypeFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { render } from '@/utils/rendererRTL'
import { RuleField } from './RuleField'

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

test('shows required marker and tooltip when value is empty', async () => {
  render(
    <RuleField
      mentionFields={mockDocumentTypeFields}
      onChange={jest.fn()}
      value=""
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.RULE_PLACEHOLDER))
  const requiredMark = screen.getByText(REQUIRED_FIELD_MARKER)

  expect(input).toHaveValue('')
  expect(requiredMark).toBeInTheDocument()

  await userEvent.hover(input)

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(localize(Localization.REQUIRED_FIELD))
  })
})

test('hides required marker and tooltip when value is provided', async () => {
  render(
    <RuleField
      mentionFields={mockDocumentTypeFields}
      onChange={jest.fn()}
      value="abc"
    />,
  )

  expect(screen.queryByTestId('required-mark')).not.toBeInTheDocument()
})

test('calls onChange prop on input change', async () => {
  const mockOnChange = jest.fn()
  const mockRule = 'Rule text'

  render(
    <RuleField
      mentionFields={mockDocumentTypeFields}
      onChange={mockOnChange}
      value=""
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.RULE_PLACEHOLDER))
  await userEvent.type(input, mockRule)
  expect(mockOnChange).toHaveBeenCalledTimes(mockRule.length)
})

test('strips newline characters before calling onChange', async () => {
  const mockOnChange = jest.fn()
  const textWithNewlines = 'line1\nline2\r\nline3'

  render(
    <RuleField
      mentionFields={mockDocumentTypeFields}
      onChange={mockOnChange}
      value=""
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.RULE_PLACEHOLDER))
  await userEvent.type(input, textWithNewlines)

  const concatenated = mockOnChange.mock.calls.map((args) => args[0]).join('')
  expect(concatenated).toBe('line1line2line3')
})

test('renders field references with user-friendly names while preserving punctuation', () => {
  const backendValue = '(len(FfieldCode1) == int(FfieldCode2))'
  const expectedDisplay = '(len($Field Name 1) == int($Field Name 2))'

  render(
    <RuleField
      mentionFields={mockDocumentTypeFields}
      onChange={jest.fn()}
      value={backendValue}
    />,
  )

  expect(screen.getByText(expectedDisplay)).toBeInTheDocument()
})

test('falls back to field code when field mapping is unavailable', () => {
  const backendValue = 'FunknownField__3 == 10'

  render(
    <RuleField
      mentionFields={mockDocumentTypeFields}
      onChange={jest.fn()}
      value={backendValue}
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.RULE_PLACEHOLDER))
  expect(input).toHaveValue(backendValue)
})

test('renders field names when document type fields provide an index', () => {
  const field = new DocumentTypeField(
    'kvCode',
    'KV Name',
    new DictFieldMeta(),
    FieldType.DICTIONARY,
    false,
    0,
    'mockDocumentTypeCode',
    1,
  )

  const backendValue = 'FkvCode__0'
  const expectedDisplay = '$KV Name__0'

  render(
    <RuleField
      mentionFields={[field]}
      onChange={jest.fn()}
      value={backendValue}
    />,
  )

  expect(screen.getByText(expectedDisplay)).toBeInTheDocument()
})

test('denormalizes outgoing value and preserves following characters', async () => {
  const mockOnChange = jest.fn()
  const initial = 'FfieldCode1) and FfieldCode2'

  render(
    <RuleField
      mentionFields={mockDocumentTypeFields}
      onChange={mockOnChange}
      value={initial}
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.RULE_PLACEHOLDER))
  await userEvent.type(input, ' ')

  const lastCallArg = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]
  expect(lastCallArg).toBe(`${initial} `)
})

test('normalizes strings mixing multiple mentions and plain text', () => {
  const backendValue = 'if FfieldCode1 > 0 and FfieldCode2 < 10 then FfieldCode1 + FfieldCode2'
  const expectedDisplay = 'if $Field Name 1 > 0 and $Field Name 2 < 10 then $Field Name 1 + $Field Name 2'

  render(
    <RuleField
      mentionFields={mockDocumentTypeFields}
      onChange={jest.fn()}
      value={backendValue}
    />,
  )

  expect(screen.getByText(expectedDisplay)).toBeInTheDocument()
})

test('normalizes mentions followed by punctuation characters', () => {
  const backendValue = 'FfieldCode1, FfieldCode2.'
  const expectedDisplay = '$Field Name 1, $Field Name 2.'

  render(
    <RuleField
      mentionFields={mockDocumentTypeFields}
      onChange={jest.fn()}
      value={backendValue}
    />,
  )

  expect(screen.getByText(expectedDisplay)).toBeInTheDocument()
})
