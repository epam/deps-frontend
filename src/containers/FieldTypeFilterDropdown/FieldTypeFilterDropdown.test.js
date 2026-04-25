
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { within } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { setActiveFieldTypes } from '@/actions/documentReviewPage'
import { ACTIVE_FIELD_TYPES } from '@/constants/field'
import { FieldType, RESOURCE_FIELDS_TYPES } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FieldTypeFilterDropdown } from './FieldTypeFilterDropdown'

jest.mock('@/utils/env', () => mockEnv)

const mockSetFieldTypesAction = {
  type: setActiveFieldTypes.toString(),
}

jest.mock('@/actions/documentReviewPage', () => ({
  setActiveFieldTypes: jest.fn(() => mockSetFieldTypesAction),
}))

jest.mock('@/selectors/documentReviewPage')

let user

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()
  user = userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
  })
})

afterEach(() => {
  jest.useRealTimers()
})

const renderAndOpenDropdown = async () => {
  render(<FieldTypeFilterDropdown />)

  const triggerButton = screen.getByRole('button', {
    name: localize(Localization.FIELD_TYPE),
  })

  await user.click(triggerButton)
}

test('shows dropdown with correct content on trigger button click', async () => {
  await renderAndOpenDropdown()

  const dropdownMenu = screen.getByRole('menu')
  const enableAllItem = screen.getByRole('menuitem', {
    name: localize(Localization.ENABLE_ALL),
  })

  expect(dropdownMenu).toBeInTheDocument()
  expect(enableAllItem).toBeInTheDocument()

  ACTIVE_FIELD_TYPES.forEach((fieldType) => {
    const fieldTypeItem = screen.getByRole('menuitem', {
      name: RESOURCE_FIELDS_TYPES[fieldType],
    })
    expect(fieldTypeItem).toBeInTheDocument()
  })
})

test('calls setActiveFieldTypes action with correct argument on Enable All switch click', async () => {
  await renderAndOpenDropdown()

  const enableAllItem = screen.getByRole('menuitem', {
    name: localize(Localization.ENABLE_ALL),
  })

  const enableAllSwitch = within(enableAllItem).getByRole('switch')
  expect(enableAllSwitch).toBeChecked()

  await user.click(enableAllSwitch, {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  expect(setActiveFieldTypes).nthCalledWith(1, [])
})

test('calls setActiveFieldTypes action with correct argument on Field Type switch click', async () => {
  jest.clearAllMocks()

  await renderAndOpenDropdown()

  const fieldTypeToSwitchOff = FieldType.STRING
  const fieldTypeItem = screen.getByRole('menuitem', {
    name: RESOURCE_FIELDS_TYPES[FieldType.STRING],
  })
  const fieldTypeSwitch = within(fieldTypeItem).getByRole('switch')

  expect(fieldTypeSwitch).toBeChecked()

  await user.click(fieldTypeSwitch, {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  const visibleFieldTypes = ACTIVE_FIELD_TYPES.filter(
    (type) => type !== fieldTypeToSwitchOff,
  )

  expect(setActiveFieldTypes).nthCalledWith(1, visibleFieldTypes)
})
