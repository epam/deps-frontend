
import { mockEnv } from '@/mocks/mockEnv'
import { mockLocalStorageWrapper } from '@/mocks/mockLocalStorageWrapper'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { HAS_SEEN_MERGED_CELLS_NOTICE, HAS_SEEN_NO_TABLE_SELECTED_NOTICE } from '@/constants/storage'
import { Localization, localize } from '@/localization/i18n'
import { TableCellLayout, TableLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { localStorageWrapper } from '@/utils/localStorageWrapper'
import { render } from '@/utils/rendererRTL'
import { NotificationMessage } from './NotificationMessage'

jest.mock('@/utils/localStorageWrapper', () => mockLocalStorageWrapper())
jest.mock('@/utils/env', () => mockEnv)

beforeEach(() => {
  jest.clearAllMocks()
})

const mockMergedCell = new TableCellLayout({
  content: 'Cell content',
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 2,
  rowIndex: 0,
  rowSpan: 1,
  page: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockCell = new TableCellLayout({
  content: 'Cell content',
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 1,
  rowIndex: 0,
  rowSpan: 1,
  page: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockTableWithMergedCells = new TableLayout({
  id: 'id1',
  order: 1,
  cells: [mockMergedCell],
  confidence: 0,
  columnCount: 1,
  rowCount: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockTableWithoutMergedCells = new TableLayout({
  id: 'id1',
  order: 1,
  cells: [mockCell],
  confidence: 0,
  columnCount: 1,
  rowCount: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

test('shows "no table selected" notice when no table is active and user has not seen the notice', () => {
  render(
    <NotificationMessage />,
  )

  const description = screen.getByText(localize(Localization.NO_TABLE_SELECTED_NOTIFICATION))
  const message = screen.getByText(localize(Localization.NO_TABLE_SELECTED))

  expect(description).toBeInTheDocument()
  expect(message).toBeInTheDocument()
})

test('shows merged cells notice when table with merged cells is active and user has not seen the notice yet', () => {
  render(
    <NotificationMessage
      activeTable={mockTableWithMergedCells}
    />,
  )

  const description = screen.getByText(localize(Localization.MERGED_CELLS_NOTIFICATION))
  const message = screen.getByText(localize(Localization.MERGED_CELLS_DETECTED))

  expect(description).toBeInTheDocument()
  expect(message).toBeInTheDocument()
})

test('does not show merged cells notice if no merged cells in the active table', () => {
  render(
    <NotificationMessage
      activeTable={mockTableWithoutMergedCells}
    />,
  )

  const description = screen.queryByText(localize(Localization.MERGED_CELLS_NOTIFICATION))
  const message = screen.queryByText(localize(Localization.MERGED_CELLS_DETECTED))

  expect(description).not.toBeInTheDocument()
  expect(message).not.toBeInTheDocument()
})

test('sets flag in localStorage when merged cells notice is closed', async () => {
  render(
    <NotificationMessage
      activeTable={mockTableWithMergedCells}
    />,
  )

  const closeButton = screen.getByRole('button')
  await userEvent.click(closeButton)

  expect(localStorageWrapper.setItem).toHaveBeenCalledWith(HAS_SEEN_MERGED_CELLS_NOTICE, true)
})

test('sets flag in localStorage when no table notice is closed', async () => {
  render(
    <NotificationMessage />,
  )
  const closeButton = screen.getByRole('button')
  await userEvent.click(closeButton)

  expect(localStorageWrapper.setItem).toHaveBeenCalledWith(HAS_SEEN_NO_TABLE_SELECTED_NOTICE, true)
})
