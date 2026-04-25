
import { mockEnv } from '@/mocks/mockEnv'
import { render, screen } from '@testing-library/react'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import {
  DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY,
  DocumentTypesGroupsFilterKey,
  SortDirection,
} from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypesGroupsColumn } from '../DocumentTypesGroupsColumn'
import { generateGroupNameColumn } from '../groupNameColumn'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Table/TableSearchDropdown', () => ({
  TableSearchDropdown: jest.fn(() => <div data-testid="table-search-dropdown" />),
}))

jest.mock('@/components/Table/TableFilterIndicator', () => ({
  TableFilterIndicator: jest.fn(() => <div data-testid="table-filter-indicator" />),
}))

jest.mock('@/components/LongText', () => ({
  LongText: jest.fn(({ text }) => <div data-testid="long-text">{text}</div>),
}))

const filterConfig = {
  [DocumentTypesGroupsFilterKey.NAME]: 'test-filter',
  [DocumentTypesGroupsFilterKey.SORT_BY]: DocumentTypesGroupsColumn.NAME,
  [DocumentTypesGroupsFilterKey.SORT_ORDER]: SortDirection.ASC,
}

test('returns the correct column configuration', () => {
  const column = generateGroupNameColumn(filterConfig)

  expect(column.title).toBe(localize(Localization.NAME))
  expect(column.dataIndex).toBe(DocumentTypesGroupsColumn.NAME)
  expect(column.key).toBe(DocumentTypesGroupsColumn.NAME)
  expect(column.filteredValue).toBe(filterConfig[DocumentTypesGroupsFilterKey.NAME])
  expect(column.sorter).toBe(true)
  expect(column.sortOrder).toBe(DATA_FILTER_KEY_TO_TABLE_SORT_DIRECT_KEY[SortDirection.ASC])
})

test('shows the filterDropdown component correctly', () => {
  const column = generateGroupNameColumn(filterConfig)

  const setSelectedKeysMock = jest.fn()
  const confirmMock = jest.fn()
  const filterDropdown = column.filterDropdown({
    setSelectedKeys: setSelectedKeysMock,
    confirm: confirmMock,
    visible: true,
  })

  render(filterDropdown)

  expect(screen.getByTestId('table-search-dropdown')).toBeInTheDocument()
  expect(TableSearchDropdown).toHaveBeenCalledWith(
    expect.objectContaining({
      confirm: expect.any(Function),
      onChange: setSelectedKeysMock,
      searchValue: 'test-filter',
      visible: true,
    }),
    {},
  )
})

test('shows the filterIcon component correctly', () => {
  const column = generateGroupNameColumn(filterConfig)

  const filterIcon = column.filterIcon()
  render(filterIcon)

  expect(screen.getByTestId('table-filter-indicator')).toBeInTheDocument()
})

test('shows the group name correctly in the render function', () => {
  const column = generateGroupNameColumn(filterConfig)

  const name = 'Test Name'
  const renderResult = column.render(name)

  render(renderResult)

  expect(screen.getByTestId('long-text')).toHaveTextContent(name)
})
