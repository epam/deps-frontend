
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { Field, MULTIPLICITY } from '../viewModels'
import { ReorderFieldsButton } from './ReorderFieldsButton'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/PromptCalibrationStudio/hooks', () => ({
  useFieldCalibration: jest.fn(() => ({
    fields: mockFields,
    reorderFields: mockReorderFields,
  })),
}))

const mockReorderFields = jest.fn()

const mockField1 = new Field({
  id: 'field-1',
  name: 'Test Field',
  fieldType: FieldType.STRING,
  extractorId: 'extractor-1',
  multiplicity: MULTIPLICITY.SINGLE,
  value: 'Test Value',
  order: 0,
})

const mockField2 = new Field({
  id: 'field-2',
  name: 'Test Field 2',
  fieldType: FieldType.STRING,
  extractorId: 'extractor-2',
  multiplicity: MULTIPLICITY.SINGLE,
  value: 'Test Value 2',
  order: 1,
})

const mockFields = [mockField1, mockField2]

const reorderFieldsAndSave = async () => {
  const reorderedFields = [mockField2, mockField1]

  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementationOnce(() => [reorderedFields, jest.fn()])
  useStateSpy.mockImplementationOnce(() => [true, jest.fn()])

  render(
    <ReorderFieldsButton />,
  )

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  await userEvent.click(saveButton)
}

test('shows drawer with fields on trigger button click', async () => {
  render(
    <ReorderFieldsButton />,
  )

  const triggerButton = screen.getByRole('button', {
    name: localize(Localization.FIELDS_ORDER),
  })

  await userEvent.click(triggerButton)

  const drawer = screen.getByTestId('drawer')
  const drawerTitle = screen.getByText(localize(Localization.CHANGE_FIELDS_ORDER))

  expect(drawer).toBeInTheDocument()
  expect(drawerTitle).toBeInTheDocument()

  mockFields.forEach((f) => {
    expect(screen.getByText(f.name)).toBeInTheDocument()
  })
})

test('disable save button if fields order was not changed', async () => {
  render(
    <ReorderFieldsButton />,
  )

  const triggerButton = screen.getByRole('button', {
    name: localize(Localization.FIELDS_ORDER),
  })

  await userEvent.click(triggerButton)

  const saveButton = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  expect(saveButton).toBeDisabled()
})

test('reorder fields and save', async () => {
  await reorderFieldsAndSave()

  expect(mockReorderFields).toHaveBeenCalledWith([
    {
      ...mockField2,
      order: 0,
    },
    {
      ...mockField1,
      order: 1,
    },
  ])
})
