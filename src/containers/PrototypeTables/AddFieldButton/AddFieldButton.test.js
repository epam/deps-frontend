
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setActiveTable, toggleAddFieldDrawer } from '@/actions/prototypePage'
import { Localization, localize } from '@/localization/i18n'
import { activeTableSelector } from '@/selectors/prototypePage'
import { render } from '@/utils/rendererRTL'
import { AddFieldButton } from './AddFieldButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/prototypePage')
jest.mock('@/containers/CreatePrototypeTableField', () => mockShallowComponent('CreatePrototypeTableField'))

jest.mock('@/actions/prototypePage', () => ({
  toggleAddFieldDrawer: jest.fn(() => ({ type: 'mockType' })),
  setActiveTable: jest.fn(() => ({ type: 'mockType' })),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('calls toggleAddFieldDrawer on button click', async () => {
  render(
    <AddFieldButton
      addField={jest.fn()}
      isEditMode={true}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.ADD_NEW),
  })
  await userEvent.click(button)

  expect(toggleAddFieldDrawer).toHaveBeenCalled()
})

test('calls setActiveTable on button click if activeTable exists', async () => {
  render(
    <AddFieldButton
      addField={jest.fn()}
      isEditMode={true}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.ADD_NEW),
  })
  await userEvent.click(button)

  expect(activeTableSelector.getSelectorMockValue()).toBeDefined()
  expect(setActiveTable).nthCalledWith(1, null)
})

test('does not call setActiveTable when activeTable does not exist', async () => {
  activeTableSelector.mockReturnValue(null)

  render(
    <AddFieldButton
      addField={jest.fn()}
      isEditMode={true}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.ADD_NEW),
  })
  await userEvent.click(button)

  expect(setActiveTable).not.toHaveBeenCalled()
})

test('renders create field component', async () => {
  render(
    <AddFieldButton
      addField={jest.fn()}
      isEditMode={true}
    />,
  )

  expect(screen.getByTestId('CreatePrototypeTableField')).toBeInTheDocument()
})

test('enables edit mode when user clicks the button in readonly mode', async () => {
  const mockToggleEditMode = jest.fn()

  render(
    <AddFieldButton
      addField={jest.fn()}
      isEditMode={false}
      toggleEditMode={mockToggleEditMode}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.ADD_NEW),
  })
  await userEvent.click(button)

  expect(mockToggleEditMode).toHaveBeenCalled()
})
