
import { mockEnv } from '@/mocks/mockEnv'
import { render, screen } from '@testing-library/react'
import { TableDateRangeFilter } from '@/components/Table/TableDateRangeFilter'
import {
  DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY,
  DocumentTypesGroupsFilterKey,
  SortDirection,
} from '@/constants/navigation'
import { generateGroupCreationDateColumn } from '@/containers/DocumentTypesGroups/columns'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypesGroupsColumn } from '../DocumentTypesGroupsColumn'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Table/TableDateRangeFilter', () => ({
  TableDateRangeFilter: jest.fn(() => <div data-testid="table-date-filter" />),
}))

jest.mock('@/components/Table/TableFilterIndicator', () => ({
  TableFilterIndicator: jest.fn(() => <div data-testid="table-filter-indicator" />),
}))

jest.mock('@/utils/dayjs', () => ({
  ...jest.requireActual('@/utils/dayjs'),
  toLocalizedDateString: jest.fn(() => mockLocalizedDate),
}))

const date = '2020-04-21T07:51:32.844606+00:00'
const mockLocalizedDate = '04/21/2020'
const filteredValue = [date, date]
const filterConfig = {
  [DocumentTypesGroupsFilterKey.DATE_START]: date,
  [DocumentTypesGroupsFilterKey.DATE_END]: date,
  [DocumentTypesGroupsFilterKey.SORT_BY]: DocumentTypesGroupsColumn.CREATION_DATE,
  [DocumentTypesGroupsFilterKey.SORT_ORDER]: SortDirection.ASC,
}

test('returns the correct column configuration', () => {
  const column = generateGroupCreationDateColumn(filterConfig)

  expect(column.title).toBe(localize(Localization.CREATION_DATE))
  expect(column.dataIndex).toBe(DocumentTypesGroupsColumn.CREATION_DATE)
  expect(column.key).toBe(DocumentTypesGroupsColumn.CREATION_DATE)
  expect(column.filteredValue).toStrictEqual(filteredValue)
  expect(column.sorter).toBe(true)
  expect(column.sortOrder).toBe(DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[SortDirection.ASC])
})

test('shows the filterDropdown component correctly', () => {
  const column = generateGroupCreationDateColumn(filterConfig)

  const setSelectedKeysMock = jest.fn()
  const confirmMock = jest.fn()
  const filterDropdown = column.filterDropdown({
    setSelectedKeys: setSelectedKeysMock,
    confirm: confirmMock,
    visible: true,
  })

  render(filterDropdown)

  expect(screen.getByTestId('table-date-filter')).toBeInTheDocument()
  expect(TableDateRangeFilter).toHaveBeenCalledWith(
    expect.objectContaining({
      confirm: confirmMock,
      onChange: setSelectedKeysMock,
      dateRange: filteredValue,
      autoFocus: true,
    }),
    {},
  )
})

test('shows the filterIcon component correctly', () => {
  const column = generateGroupCreationDateColumn(filterConfig)

  const filterIcon = column.filterIcon()
  render(filterIcon)

  expect(screen.getByTestId('table-filter-indicator')).toBeInTheDocument()
})

test('shows the localized date correctly after the render call', () => {
  const column = generateGroupCreationDateColumn(filterConfig)

  const renderResult = column.render(date)

  render(renderResult)

  expect(screen.getByText(mockLocalizedDate)).toBeInTheDocument()
})
