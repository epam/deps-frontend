
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { render } from '@/utils/rendererRTL'
import { FieldBusinessRuleForm } from './FieldBusinessRuleForm'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentType')
jest.mock('react-hook-form', () => mockReactHookForm)

const mockDocumentTypeField = new DocumentTypeField(
  'stringFieldCode',
  'String Field',
  {},
  FieldType.STRING,
  false,
  1,
  'mockDocTypeCode',
  'pk',
)

const mockDocumentType = new ExtendedDocumentType({
  code: 'mockDocTypeCode',
  name: 'Doc Type 1',
  fields: [mockDocumentTypeField],
})

beforeEach(() => {
  jest.clearAllMocks()
  documentTypeStateSelector.mockReturnValue(mockDocumentType)
})

jest.mock('@/selectors/documentType', () => ({
  documentTypeStateSelector: jest.fn(() => ({
    fields: [
      {
        code: 'code1',
        name: 'Field 1',
      },
      {
        code: 'code2',
        name: 'Field 2',
      },
    ],
  })),
}))

test('renders form fields with proper labels', () => {
  render(
    <FieldBusinessRuleForm
      handleSubmit={jest.fn()}
      onSubmit={jest.fn()}
    />,
  )

  expect(screen.getByText(localize(Localization.NAME))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.TYPE))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.LIST_FIELDS_VALIDATION_MODE))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.VALIDATED_FIELDS))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.NAME))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.ISSUE_MESSAGE))).toBeInTheDocument()
})

test('shows correct placeholders for required fields', () => {
  render(
    <FieldBusinessRuleForm
      handleSubmit={jest.fn()}
      onSubmit={jest.fn()}
    />,
  )

  expect(screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))).toBeInTheDocument()
  expect(screen.getByPlaceholderText(localize(Localization.ISSUE_MESSAGE_PLACEHOLDER))).toBeInTheDocument()

  const [listModeSelect, validatedFieldsSelect] = screen.getAllByTestId('CustomSelect')

  expect(listModeSelect).toHaveTextContent(localize(Localization.NOT_APPLIED_TEXT))
  expect(validatedFieldsSelect).toHaveTextContent(localize(Localization.ENTER_VALIDATED_FIELDS))
})

test('checks that severity field has correct default value (ERROR)', () => {
  render(
    <FieldBusinessRuleForm
      handleSubmit={jest.fn()}
      onSubmit={jest.fn()}
    />,
  )

  const errorSeverityOption = screen.getByRole('radio', { name: localize(Localization.ERROR) })
  const warningSeverityOption = screen.getByRole('radio', { name: localize(Localization.WARNING) })

  expect(errorSeverityOption).toBeChecked()
  expect(warningSeverityOption).not.toBeChecked()
})

test('checks that list mode field has no default selection and exposes required options', async () => {
  render(
    <FieldBusinessRuleForm
      handleSubmit={jest.fn()}
      onSubmit={jest.fn()}
    />,
  )

  const listModeSelect = screen.getAllByTestId('CustomSelect')[0]

  expect(listModeSelect).toHaveTextContent(localize(Localization.NOT_APPLIED_TEXT))

  const listModeCombobox = screen.getAllByRole('combobox')[0]
  await userEvent.click(listModeCombobox)
  await userEvent.keyboard('{ArrowDown}')

  expect(await screen.findByText(localize(Localization.FOR_ANY_ITEM))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.FOR_EACH_ITEM))).toBeInTheDocument()
  expect(screen.getAllByRole('option')).toHaveLength(2)
})

test('renders hint texts for rule and issue message fields', () => {
  render(
    <FieldBusinessRuleForm
      handleSubmit={jest.fn()}
      onSubmit={jest.fn()}
    />,
  )

  const hintText = localize(Localization.FIELD_REFERENCE_HINT)
  expect(screen.getAllByText(hintText)).toHaveLength(2)
})
