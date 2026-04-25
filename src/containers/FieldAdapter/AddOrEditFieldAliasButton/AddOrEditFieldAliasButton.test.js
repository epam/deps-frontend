
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { ExtractedDataField, FieldData } from '@/models/ExtractedData'
import { render } from '@/utils/rendererRTL'
import { AddOrEditFieldAliasButton } from './AddOrEditFieldAliasButton'

jest.mock('@/utils/env', () => mockEnv)

const MockInput = ({
  onCancel,
  onSubmit,
  value,
}) => {
  return (
    <div>
      <input
        defaultValue={value}
      />
      <button
        data-testid={mockSubmitButtonId}
        onClick={() => onSubmit(newAlias)}
      />
      <button
        data-testid={mockCancelButtonId}
        onClick={onCancel}
      />
    </div>
  )
}

jest.mock('@/components/TextEditorModal', () => ({
  TextEditorModal: (props) => <MockInput {...props} />,
}))

const mockElement = document.createElement('div')
mockElement.getBoundingClientRect = jest.fn(() => ({
  left: 100,
  top: 100,
}))

jest.spyOn(window.document, 'getElementById').mockReturnValue({
  firstChild: {
    firstChild: {
      lastChild: mockElement,
    },
  },
})

const mockField = new FieldData(
  'test value 1',
  null,
  null,
  null,
  0,
  null,
  null,
  null,
  null,
  null,
  'subFieldId',
)

const mockSubField = new ExtractedDataField('subfieldPk', mockField)

const mockAlias = 'mockAlias'
const newAlias = 'newAlias'
const mockSubmitButtonId = 'submit-button'
const mockCancelButtonId = 'cancel-button'

test('shows correct button text if alias is passed', async () => {
  render(
    <AddOrEditFieldAliasButton
      alias={mockAlias}
      containerId={'testId'}
      disabled={false}
      field={mockSubField}
      isSaving={false}
      onSave={jest.fn()}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.EDIT_FIELD_NAME),
  })

  expect(button).toBeInTheDocument()
})

test('shows correct button text if alias is not passed', async () => {
  render(
    <AddOrEditFieldAliasButton
      containerId={'testId'}
      disabled={false}
      field={mockSubField}
      isSaving={false}
      onSave={jest.fn()}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.SET_FIELD_NAME),
  })

  expect(button).toBeInTheDocument()
})

test('should be disabled if disable prop is true', async () => {
  render(
    <AddOrEditFieldAliasButton
      alias={mockAlias}
      containerId={'testId'}
      disabled={true}
      field={mockSubField}
      isSaving={false}
      onSave={jest.fn()}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.EDIT_FIELD_NAME),
  })

  expect(button).toBeDisabled()
})

test('shows text editor if button is clicked', async () => {
  render(
    <AddOrEditFieldAliasButton
      alias={mockAlias}
      containerId={'testId'}
      disabled={false}
      field={mockSubField}
      isSaving={false}
      onSave={jest.fn()}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.EDIT_FIELD_NAME),
  })
  await userEvent.click(button)

  const input = screen.getByRole('textbox')

  expect(input).toBeInTheDocument()
  expect(input).toHaveValue(mockAlias)
})

test('calls onSave prop with passed value and close editor if Submit button is clicked', async () => {
  const mockOnSave = jest.fn()

  render(
    <AddOrEditFieldAliasButton
      alias={mockAlias}
      containerId={'testId'}
      disabled={false}
      field={mockSubField}
      isSaving={false}
      onSave={mockOnSave}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.EDIT_FIELD_NAME),
  })
  await userEvent.click(button)

  const submitButton = screen.getByTestId(mockSubmitButtonId)
  await userEvent.click(submitButton)

  expect(mockOnSave).nthCalledWith(
    1,
    mockSubField,
    newAlias,
  )

  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('close editor if Cancel button is clicked', async () => {
  render(
    <AddOrEditFieldAliasButton
      alias={mockAlias}
      containerId={'testId'}
      disabled={false}
      field={mockSubField}
      isSaving={false}
      onSave={jest.fn()}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.EDIT_FIELD_NAME),
  })
  await userEvent.click(button)

  const cancelButton = screen.getByTestId(mockCancelButtonId)
  await userEvent.click(cancelButton)

  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})
