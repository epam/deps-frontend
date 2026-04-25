
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { setActiveLayoutId, setActiveTable } from '@/actions/prototypePage'
import { ReferenceLayoutState } from '@/enums/ReferenceLayoutState'
import { Localization, localize } from '@/localization/i18n'
import { ReferenceLayout } from '@/models/ReferenceLayout'
import { activeLayoutIdSelector } from '@/selectors/prototypePage'
import { render } from '@/utils/rendererRTL'
import { LayoutsListDropdown } from './LayoutsListDropdown'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/prototypePage')
jest.mock('@/components/Icons/XMarkIcon', () => ({
  XMarkIcon: () => <div data-testid='delete-icon' />,
}))

jest.mock('@/actions/prototypePage', () => ({
  setActiveLayoutId: jest.fn(() => mockAction),
  setActiveTable: jest.fn(() => mockAction),
}))

const mockAction = { type: 'action' }

const mockLayout = new ReferenceLayout({
  id: 'mockId1',
  blobName: 'mockBlobName1',
  prototypeId: 'mockPrototypeId',
  state: ReferenceLayoutState.PARSING,
  title: 'mockTitle1',
})

const mockFailedLayout = new ReferenceLayout({
  id: 'mockId2',
  blobName: 'mockBlobName2',
  prototypeId: 'mockPrototypeId',
  state: ReferenceLayoutState.FAILED,
  title: 'mockFailedLayout',
})

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

test('shows dropdown menu with list of reference layouts', async () => {
  const mockLayoutsList = [mockLayout, mockFailedLayout]
  render(
    <LayoutsListDropdown
      layoutsList={mockLayoutsList}
      removeLayout={jest.fn()}
    />,
  )

  await user.click(screen.getByLabelText('down'))

  const menuItems = screen.getAllByRole('menuitem')

  expect(menuItems).toHaveLength(mockLayoutsList.length)
  mockLayoutsList.forEach((layout, index) =>
    expect(menuItems[index]).toHaveTextContent(layout.title),
  )
})

test('changes layout and clear prev data in case of click on layout in reference layouts list', async () => {
  activeLayoutIdSelector.mockReturnValueOnce(mockLayout.id)

  const mockLayoutsList = [mockLayout]

  render(
    <LayoutsListDropdown
      layoutsList={mockLayoutsList}
      removeLayout={jest.fn()}
    />,
  )

  await user.click(screen.getByLabelText('down'))

  await user.click(screen.getByRole('menuitem'), {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  expect(setActiveLayoutId).nthCalledWith(1, mockLayout.id)
  expect(setActiveTable).nthCalledWith(1, null)
})

test('shows state for failed layout in reference layouts list', async () => {
  const mockLayoutsList = [mockFailedLayout]

  render(
    <LayoutsListDropdown
      layoutsList={mockLayoutsList}
      removeLayout={jest.fn()}
    />,
  )

  await user.click(screen.getByLabelText('down'))

  const menuItem = screen.getByRole('menuitem')
  expect(menuItem).toHaveTextContent(localize(Localization.FAILED))
})

test('calls removeLayout with correct argument in case of click on delete layout button on reference layouts list', async () => {
  const mockLayoutsList = [mockLayout]
  const mockRemoveLayout = jest.fn()

  render(
    <LayoutsListDropdown
      layoutsList={mockLayoutsList}
      removeLayout={mockRemoveLayout}
    />,
  )

  await user.click(screen.getByLabelText('down'))

  await user.click(screen.getByTestId('delete-icon'), {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  expect(mockRemoveLayout).nthCalledWith(1, mockLayout.id)
})
