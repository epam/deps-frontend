
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { render, screen } from '@testing-library/react'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { TableSortDirection } from '@/components/Table/TableSorter'
import { Localization, localize } from '@/localization/i18n'
import { ColumnCode } from '../../ColumnCode'
import { generateFileNameColumn } from '../generateFileNameColumn'

var mockLongText

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Table/TableFilterIndicator', () => mockShallowComponent('TableFilterIndicator'))
jest.mock('@/components/Table/TableSearchDropdown', () => mockShallowComponent('TableSearchDropdown'))
jest.mock('@/components/LongText', () => {
  const mock = mockShallowComponent('LongText')
  mockLongText = mock.LongText
  return mock
})

const filterConfig = {
  name: 'test-filter',
  sortField: ColumnCode.NAME,
  sortDirect: TableSortDirection.ASCEND,
}

test('returns the correct column configuration', () => {
  const column = generateFileNameColumn(filterConfig)

  expect(column.title).toBe(localize(Localization.FILE_NAME).toUpperCase())
  expect(column.dataIndex).toBe(ColumnCode.NAME)
  expect(column.key).toBe(ColumnCode.NAME)
  expect(column.filteredValue).toBe(filterConfig.name)
  expect(column.sorter).toEqual(expect.any(Function))
  expect(column.sortOrder).toBe(TableSortDirection.ASCEND)
})

test('shows the filterDropdown component correctly', () => {
  const column = generateFileNameColumn(filterConfig)

  const setSelectedKeysMock = jest.fn()
  const confirmMock = jest.fn()
  const filterDropdown = column.filterDropdown({
    setSelectedKeys: setSelectedKeysMock,
    confirm: confirmMock,
    visible: true,
  })

  render(filterDropdown)

  expect(screen.getByTestId('TableSearchDropdown')).toBeInTheDocument()
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
  const column = generateFileNameColumn(filterConfig)

  const filterIcon = column.filterIcon()
  render(filterIcon)

  expect(screen.getByTestId('TableFilterIndicator')).toBeInTheDocument()
})

test('shows the batch name correctly in the render function', () => {
  const column = generateFileNameColumn(filterConfig)

  const name = 'Test Name'
  const renderResult = column.render(name)

  render(renderResult)

  expect(mockLongText.getProps()).toEqual({
    text: name,
  })
})
