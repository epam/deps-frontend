
import { mockEnv } from '@/mocks/mockEnv'
import { mockUuid } from '@/mocks/mockUuid'
import { render } from '@/utils/rendererRTL'
import { StyledTable } from './Table.styles'
import { useTableColumnsResize } from './useTableColumnsResize'
import { Table } from './'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('uuid', () => mockUuid)

jest.mock('@/utils/window', () => ({
  outerHeight: jest.fn(() => 24),
  openInNewTarget: jest.requireActual('@/utils/window').openInNewTarget,
}))

jest.mock('./useTableColumnsResize', () => ({
  useTableColumnsResize: jest.fn(),
}))

jest.mock('./Table.styles', () => {
  const React = require('react')
  const StyledTable = jest.fn(() => (
    React.createElement('template', { 'data-testid': 'StyledTable' })
  ))
  return {
    __esModule: true,
    StyledTable,
  }
})

jest.mock('./TableHeaderCell', () => ({
  TableHeaderCell: jest.fn(() => null),
}))

const baseColumns = [
  {
    title: 'Title',
    dataIndex: 'title',
  },
  {
    title: 'Date',
    dataIndex: 'date',
  },
]

const baseData = [
  {
    key: '1',
    title: 'Config 100',
    date: '20.07.2018',
  },
  {
    key: '2',
    title: 'Config 2',
    date: '30.07.2018',
  },
]

beforeEach(() => {
  jest.clearAllMocks()
  useTableColumnsResize.mockReturnValue({
    processedColumns: baseColumns,
    isResizing: false,
  })
})

test('passes processedColumns from hook and showSorterTooltip equals !isResizing', () => {
  const processed = [{
    title: 'X',
    dataIndex: 'x',
  }]
  useTableColumnsResize.mockReturnValueOnce({
    processedColumns: processed,
    isResizing: true,
  })

  render(
    <Table
      columns={baseColumns}
      data={baseData}
      pagination={false}
    />,
  )

  expect(StyledTable).toHaveBeenCalledWith(
    expect.objectContaining({
      columns: processed,
      showSorterTooltip: false,
    }),
    expect.anything(),
  )
})

test('uses original columns when all disableResize are true and does not override header cell', () => {
  const disabled = baseColumns.map((c) => ({
    ...c,
    disableResize: true,
  }))
  useTableColumnsResize.mockReturnValueOnce({
    processedColumns: ['processed'],
    isResizing: false,
  })

  render(
    <Table
      columns={disabled}
      data={baseData}
      pagination={false}
    />,
  )

  const props = StyledTable.mock.calls[0][0]
  expect(props.columns).toEqual(disabled)
  expect(props.components).toBeUndefined()
})

test('overrides header.cell to TableHeaderCell when at least one column can resize', () => {
  const mixed = [
    {
      title: 'A',
      dataIndex: 'a',
    },
    {
      title: 'B',
      dataIndex: 'b',
      disableResize: true,
    },
  ]

  render(
    <Table
      columns={mixed}
      data={baseData}
      pagination={false}
    />,
  )
  const props = StyledTable.mock.calls[0][0]
  const { TableHeaderCell } = require('./TableHeaderCell')
  expect(props.components.header.cell).toBe(TableHeaderCell)
})

test('computes vertical scroll from height, header and pagination heights', () => {
  render(
    <Table
      columns={baseColumns}
      data={baseData}
      height={300}
      pagination={
        {
          current: 1,
          pageSize: 10,
        }
      }
    />,
  )
  expect(StyledTable).toHaveBeenCalledWith(
    expect.objectContaining({
      scroll: { y: 292 },
    }),
    expect.anything(),
  )
})

test('passes loading prop mapped from fetching and provides custom indicator', () => {
  render(
    <Table
      columns={baseColumns}
      data={baseData}
      fetching
      pagination={false}
    />,
  )
  const { loading } = StyledTable.mock.calls[0][0]
  expect(loading.spinning).toBe(true)
  expect(loading.indicator).toBeTruthy()
})

test('omits scroll when height is undefined', () => {
  render(
    <Table
      columns={baseColumns}
      data={baseData}
      pagination={false}
    />,
  )
  const props = StyledTable.mock.calls[0][0]
  expect(props.scroll).toBeUndefined()
})
