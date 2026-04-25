
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { SheetInfo, TableInfo } from '@/models/DocumentParsingInfo'
import { render } from '@/utils/rendererRTL'
import { SheetsDropdown } from './SheetsDropdown'

jest.mock('@/utils/env', () => mockEnv)

const mockSheet = new SheetInfo({
  id: 'mockSheetId',
  title: 'Mock Title',
  isHidden: false,
  tables: [
    new TableInfo({
      id: 'mockId',
      rowCount: 1,
      columnCount: 1,
    }),
  ],
  images: [],
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

test('shows dropdown menu with list of tabular layout sheets', async () => {
  const mockSheets = [mockSheet]

  render(
    <SheetsDropdown
      activeSheet={mockSheet}
      setActiveSheet={jest.fn()}
      sheets={mockSheets}
    />,
  )

  const dropdownButton = screen.getByRole('button', {
    name: mockSheet.title,
  })

  await user.click(dropdownButton)

  const menuItems = screen.getAllByRole('menuitem')

  expect(menuItems).toHaveLength(mockSheets.length)

  mockSheets.forEach((sheet, index) => (
    expect(menuItems[index]).toHaveTextContent(sheet.title)
  ))
})

test('calls setActiveSheet prop with correct argument in case of click on sheet in the dropdown menu', async () => {
  const mockSheets = [mockSheet]
  const mockSetActiveSheet = jest.fn()

  render(
    <SheetsDropdown
      activeSheet={mockSheet}
      setActiveSheet={mockSetActiveSheet}
      sheets={mockSheets}
    />,
  )

  const dropdownButton = screen.getByRole('button', {
    name: mockSheet.title,
  })

  await user.click(dropdownButton)

  const [menuItem] = screen.getAllByRole('menuitem')

  await user.click(menuItem, {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  expect(mockSetActiveSheet).nthCalledWith(1, mockSheets[0])
})
