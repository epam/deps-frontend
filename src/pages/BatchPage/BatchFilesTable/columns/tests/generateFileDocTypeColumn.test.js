
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { render, screen } from '@testing-library/react'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { Localization, localize } from '@/localization/i18n'
import { ColumnCode } from '../../ColumnCode'
import { generateFileDocTypeColumn } from '../generateFileDocTypeColumn'

var mockBatchFileDocumentType

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Table/TableSearchDropdown', () => mockShallowComponent('TableSearchDropdown'))
jest.mock('@/components/Table/TableFilterIndicator', () => mockShallowComponent('TableFilterIndicator'))
jest.mock('@/pages/BatchPage/BatchFilesTable/BatchFileDocumentType', () => {
  const mock = mockShallowComponent('BatchFileDocumentType')
  mockBatchFileDocumentType = mock.BatchFileDocumentType
  return mock
})

const filterConfig = {
  documentTypeId: 'test-filter',
}

test('returns the correct column configuration', () => {
  const column = generateFileDocTypeColumn(filterConfig)

  expect(column.title).toBe(localize(Localization.DOCUMENT_TYPE).toUpperCase())
  expect(column.dataIndex).toBe(ColumnCode.DOC_TYPE)
  expect(column.key).toBe(ColumnCode.DOC_TYPE)
  expect(column.filteredValue).toBe(filterConfig.documentTypeId)
  expect(column.sorter).toBe(false)
})

test('shows the filterDropdown component correctly', () => {
  const column = generateFileDocTypeColumn(filterConfig)

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
  const column = generateFileDocTypeColumn(filterConfig)

  const filterIcon = column.filterIcon()
  render(filterIcon)

  expect(screen.getByTestId('TableFilterIndicator')).toBeInTheDocument()
})

test('shows the batch doc type correctly in the render function', () => {
  const column = generateFileDocTypeColumn(filterConfig)

  const type = 'Test'
  const renderResult = column.render(type)

  render(renderResult)

  expect(mockBatchFileDocumentType.getProps()).toEqual({
    documentTypeId: type,
  })
})
