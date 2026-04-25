
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { TableSortDirection } from '@/components/Table/TableSorter'
import { KnownParsingFeature, RESOURCE_PARSING_FEATURE } from '@/enums/KnownParsingFeature'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ColumnCode } from '../../ColumnCode'
import { generateFileParsingFeaturesColumn } from '../generateFileParsingFeaturesColumn'

var mockLongList

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Table/TableSelectFilter', () => mockShallowComponent('TableSelectFilter'))
jest.mock('@/components/Table/TableFilterIndicator', () => mockShallowComponent('TableFilterIndicator'))
jest.mock('@/containers/LongTagsList', () => {
  const mock = mockShallowComponent('LongTagsList')
  mockLongList = mock.LongTagsList
  return mock
})

const filterConfig = {
  parsingFeatures: ['text'],
  sortField: ColumnCode.PARSING_FEATURES,
  sortDirect: TableSortDirection.ASCEND,
}

test('returns the correct column configuration', () => {
  const column = generateFileParsingFeaturesColumn(filterConfig)

  expect(column.title).toBe(localize(Localization.PARSING_FEATURES))
  expect(column.dataIndex).toBe(ColumnCode.PARSING_FEATURES)
  expect(column.key).toBe(ColumnCode.PARSING_FEATURES)
  expect(column.filteredValue).toBe(filterConfig.parsingFeatures)
  expect(column.sorter).toBe(false)
})

test('shows the filterDropdown component correctly', () => {
  const column = generateFileParsingFeaturesColumn(filterConfig)

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
      selectedKeys: ['text'],
      setSelectedKeys: setSelectedKeysMock,
      visible: true,
    }),
    {},
  )
})

test('shows the filterIcon component correctly', () => {
  const column = generateFileParsingFeaturesColumn(filterConfig)

  const filterIcon = column.filterIcon()
  render(filterIcon)

  expect(screen.getByTestId('TableFilterIndicator')).toBeInTheDocument()
})

test('shows the batch parsing Features correctly in the render function', () => {
  const column = generateFileParsingFeaturesColumn(filterConfig)

  const features = Object.values(KnownParsingFeature)
  const renderResult = column.render(features)

  render(renderResult)

  const props = mockLongList.getProps()

  props.tags.forEach((tag) => {
    expect(features).toContain(tag.id)
    expect(tag.text).toBe(RESOURCE_PARSING_FEATURE[tag.id])
  })
})
