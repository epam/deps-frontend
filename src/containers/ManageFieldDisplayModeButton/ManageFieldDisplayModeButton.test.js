
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import { localize, Localization } from '@/localization/i18n'
import {
  PrototypeField,
  PrototypeFieldMapping,
  PrototypeFieldType,
} from '@/models/PrototypeField'
import { render } from '@/utils/rendererRTL'
import { ManageFieldDisplayModeButton } from './ManageFieldDisplayModeButton'

const mockMaskIconTestId = 'mask-icon'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/components/Icons/MaskIcon', () => ({
  MaskIcon: () => <div data-testid={mockMaskIconTestId} />,
}))
const mockUpdateFunc = jest.fn()

const mockField = new PrototypeField({
  id: '1',
  prototypeId: 'prototypeId',
  name: localize(Localization.NEW_FIELD),
  fieldType: new PrototypeFieldType({
    typeCode: FieldType.STRING,
    description: {
      displayCharLimit: 1,
    },
  }),
  mapping: new PrototypeFieldMapping({
    keys: [],
    mappingDataType: FieldType.STRING,
    mappingType: MappingType.ONE_TO_ONE,
  }),
  readOnly: true,
  confidential: true,
})

test('drawer title contains correct text', async () => {
  render(
    <ManageFieldDisplayModeButton
      field={mockField}
      updateDisplayMode={mockUpdateFunc}
    />,
  )

  await userEvent.click(screen.getByTestId(mockMaskIconTestId))

  const title = await screen.findByText(localize(Localization.DISPLAY_MODE))

  expect(title).toBeInTheDocument()
})

test('update prop is called with correct arguments when user clicks on drawer submit button', async () => {
  render(
    <ManageFieldDisplayModeButton
      field={mockField}
      updateDisplayMode={mockUpdateFunc}
    />,
  )

  await userEvent.click(screen.getByTestId(mockMaskIconTestId))
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(mockUpdateFunc).nthCalledWith(1, {
    confidential: true,
    readOnly: true,
    displayCharLimit: mockField.fieldType.description.displayCharLimit,
  })
})

test('show correct tooltip message when user hover the mask icon', async () => {
  render(
    <ManageFieldDisplayModeButton
      field={mockField}
      updateDisplayMode={mockUpdateFunc}
    />,
  )

  await userEvent.hover(screen.getByTestId(mockMaskIconTestId))

  expect(await screen.findByText(/manage display mode/i)).toBeInTheDocument()
})

test('the drawer footer is not displayed in case no update func was passed', async () => {
  jest.clearAllMocks()

  render(
    <ManageFieldDisplayModeButton
      field={mockField}
    />,
  )

  await userEvent.click(screen.getByTestId(mockMaskIconTestId))

  const cancelButton = screen.queryByRole('button', { name: /cancel/i })
  const submitButton = screen.queryByRole('button', { name: /submit/i })

  expect(cancelButton).not.toBeInTheDocument()
  expect(submitButton).not.toBeInTheDocument()
})
