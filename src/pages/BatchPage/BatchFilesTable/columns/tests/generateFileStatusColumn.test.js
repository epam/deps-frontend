
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { TableSortDirection } from '@/components/Table/TableSorter'
import { BatchFileStatus } from '@/enums/BatchFileStatus'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ColumnCode } from '../../ColumnCode'
import { generateFileStatusColumn } from '../generateFileStatusColumn'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/pages/BatchPage/BatchFilesTable/BatchFileStatusCell', () => mockShallowComponent('BatchFileStatusCell'))
jest.mock('@/components/Table/TableSelectFilter', () => mockShallowComponent('TableSelectFilter'))
jest.mock('@/components/Table/TableFilterIndicator', () => mockShallowComponent('TableFilterIndicator'))

const filterConfig = {
  status: [BatchFileStatus.PROCESSING],
  sortField: ColumnCode.STATUS,
  sortDirect: TableSortDirection.ASCEND,
}

test('returns the correct column configuration', () => {
  const column = generateFileStatusColumn(filterConfig)

  expect(column.title).toBe(localize(Localization.STATUS))
  expect(column.dataIndex).toBe(ColumnCode.STATUS)
  expect(column.key).toBe(ColumnCode.STATUS)
  expect(column.filteredValue).toBe(filterConfig.status)
  expect(column.sorter).toEqual(expect.any(Function))
  expect(column.sortOrder).toBe(TableSortDirection.ASCEND)
})

test('shows the filterDropdown component correctly', () => {
  const column = generateFileStatusColumn(filterConfig)

  const setSelectedKeysMock = jest.fn()
  const confirmMock = jest.fn()
  const filterDropdown = column.filterDropdown({
    setSelectedKeys: setSelectedKeysMock,
    confirm: confirmMock,
    visible: true,
  })

  render(filterDropdown)

  expect(screen.getByTestId('TableSelectFilter')).toBeInTheDocument()
  expect(TableSelectFilter).toHaveBeenCalledWith(
    expect.objectContaining({
      confirm: expect.any(Function),
      options: expect.any(Array),
      selectedKeys: [BatchFileStatus.PROCESSING],
      setSelectedKeys: setSelectedKeysMock,
      visible: true,
    }),
    {},
  )
})

test('shows the filterIcon component correctly', () => {
  const column = generateFileStatusColumn(filterConfig)

  const filterIcon = column.filterIcon()
  render(filterIcon)

  expect(screen.getByTestId('TableFilterIndicator')).toBeInTheDocument()
})

test('shows the batch status correctly in the render function', () => {
  const column = generateFileStatusColumn(filterConfig)

  const status = 'test'
  const renderResult = column.render(status)

  render(renderResult)

  const badge = screen.getByTestId('BatchFileStatusCell')

  expect(badge).toBeInTheDocument()
})
