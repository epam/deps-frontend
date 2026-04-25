
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { render, screen } from '@testing-library/react'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { TableSortDirection } from '@/components/Table/TableSorter'
import { Localization, localize } from '@/localization/i18n'
import { ColumnCode } from '../../ColumnCode'
import { generateFileLLMColumn } from '../generateFileLLMColumn'

var mockDocumentLLMType

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Table/TableSearchDropdown', () => mockShallowComponent('TableSearchDropdown'))
jest.mock('@/components/Table/TableFilterIndicator', () => mockShallowComponent('TableFilterIndicator'))
jest.mock('@/containers/DocumentLLMType', () => {
  const mock = mockShallowComponent('DocumentLLMType')
  mockDocumentLLMType = mock.DocumentLLMType
  return mock
})

const filterConfig = {
  llmType: 'test-filter',
  sortField: ColumnCode.LLM_TYPE,
  sortDirect: TableSortDirection.ASCEND,
}

test('returns the correct column configuration', () => {
  const column = generateFileLLMColumn(filterConfig)

  expect(column.title).toBe(localize(Localization.LLM_TYPE_UPPERCASE))
  expect(column.dataIndex).toBe(ColumnCode.LLM_TYPE)
  expect(column.key).toBe(ColumnCode.LLM_TYPE)
  expect(column.filteredValue).toBe(filterConfig.llmType)
  expect(column.sorter).toEqual(expect.any(Function))
  expect(column.sortOrder).toBe(TableSortDirection.ASCEND)
})

test('shows the filterDropdown component correctly', () => {
  const column = generateFileLLMColumn(filterConfig)

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
  const column = generateFileLLMColumn(filterConfig)

  const filterIcon = column.filterIcon()
  render(filterIcon)

  expect(screen.getByTestId('TableFilterIndicator')).toBeInTheDocument()
})

test('shows the batch llm type correctly in the render function', () => {
  const column = generateFileLLMColumn(filterConfig)

  const llm = 'Test'
  const renderResult = column.render(llm)

  render(renderResult)

  expect(mockDocumentLLMType.getProps()).toEqual({
    llmType: llm,
  })
})
