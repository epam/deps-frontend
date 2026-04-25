
import { mockEnv } from '@/mocks/mockEnv'
import { HTDataProps, HTMerge } from '@/components/HandsonTable'
import { mapTabularLayoutCellsToHandsonTableData } from './mapTabularLayoutCellsToHandsonTableData'

jest.mock('@/utils/env', () => mockEnv)

test('returns empty HTDataProps when tableData is null', () => {
  const result = mapTabularLayoutCellsToHandsonTableData(null)

  expect(result).toBeInstanceOf(HTDataProps)
  expect(result.data).toEqual([])
  expect(result.mergeCells).toEqual([])
})

test('returns empty HTDataProps when tableData is undefined', () => {
  const result = mapTabularLayoutCellsToHandsonTableData(undefined)

  expect(result).toBeInstanceOf(HTDataProps)
  expect(result.data).toEqual([])
  expect(result.mergeCells).toEqual([])
})

test('returns empty HTDataProps when tableData is not an array', () => {
  const result = mapTabularLayoutCellsToHandsonTableData('not an array')

  expect(result).toBeInstanceOf(HTDataProps)
  expect(result.data).toEqual([])
  expect(result.mergeCells).toEqual([])
})

test('returns empty HTDataProps when tableData is empty array', () => {
  const result = mapTabularLayoutCellsToHandsonTableData([])

  expect(result).toBeInstanceOf(HTDataProps)
  expect(result.data).toEqual([])
  expect(result.mergeCells).toEqual([])
})

test('creates table with single cell', () => {
  const tableData = [
    {
      relativePosition: [0, 0],
      content: 'Test Content',
    },
  ]

  const result = mapTabularLayoutCellsToHandsonTableData(tableData)

  expect(result).toBeInstanceOf(HTDataProps)
  expect(result.data).toEqual([['Test Content']])
  expect(result.mergeCells).toEqual([])
})

test('creates table with multiple cells in different positions', () => {
  const tableData = [
    {
      relativePosition: [0, 0],
      content: 'Cell 1',
    },
    {
      relativePosition: [1, 0],
      content: 'Cell 2',
    },
    {
      relativePosition: [0, 1],
      content: 'Cell 3',
    },
    {
      relativePosition: [1, 1],
      content: 'Cell 4',
    },
  ]

  const result = mapTabularLayoutCellsToHandsonTableData(tableData)

  expect(result).toBeInstanceOf(HTDataProps)
  expect(result.data).toEqual([
    ['Cell 1', 'Cell 2'],
    ['Cell 3', 'Cell 4'],
  ])
  expect(result.mergeCells).toEqual([])
})

test('creates merge cells when cell has merge property', () => {
  const tableData = [
    {
      relativePosition: [0, 0],
      content: 'Merged Cell',
      merge: {
        rowSpan: 2,
        columnSpan: 2,
      },
    },
    {
      relativePosition: [2, 0],
      content: 'Regular Cell',
    },
  ]

  const result = mapTabularLayoutCellsToHandsonTableData(tableData)

  expect(result).toBeInstanceOf(HTDataProps)
  expect(result.data).toEqual([
    ['Merged Cell', null, 'Regular Cell'],
    [null, null, null],
  ])
  expect(result.mergeCells).toEqual([
    new HTMerge(0, 0, 2, 2),
  ])
})

test('creates multiple merge cells', () => {
  const tableData = [
    {
      relativePosition: [0, 0],
      content: 'Header 1',
      merge: {
        rowSpan: 1,
        columnSpan: 2,
      },
    },
    {
      relativePosition: [2, 0],
      content: 'Header 2',
      merge: {
        rowSpan: 1,
        columnSpan: 2,
      },
    },
    {
      relativePosition: [0, 1],
      content: 'Data 1',
    },
    {
      relativePosition: [1, 1],
      content: 'Data 2',
    },
    {
      relativePosition: [2, 1],
      content: 'Data 3',
    },
    {
      relativePosition: [3, 1],
      content: 'Data 4',
    },
  ]

  const result = mapTabularLayoutCellsToHandsonTableData(tableData)

  expect(result).toBeInstanceOf(HTDataProps)
  expect(result.data).toEqual([
    ['Header 1', null, 'Header 2', null],
    ['Data 1', 'Data 2', 'Data 3', 'Data 4'],
  ])
  expect(result.mergeCells).toEqual([
    new HTMerge(0, 0, 1, 2),
    new HTMerge(0, 2, 1, 2),
  ])
})

test('sorts cells by row then column before processing', () => {
  const tableData = [
    {
      relativePosition: [1, 1],
      content: 'Cell B',
    },
    {
      relativePosition: [0, 0],
      content: 'Cell A',
    },
    {
      relativePosition: [0, 1],
      content: 'Cell C',
    },
    {
      relativePosition: [1, 0],
      content: 'Cell D',
    },
  ]

  const result = mapTabularLayoutCellsToHandsonTableData(tableData)

  expect(result).toBeInstanceOf(HTDataProps)
  expect(result.data).toEqual([
    ['Cell A', 'Cell D'],
    ['Cell C', 'Cell B'],
  ])
  expect(result.mergeCells).toEqual([])
})

test('handles cells with default merge span values', () => {
  const tableData = [
    {
      relativePosition: [0, 0],
      content: 'Cell with default spans',
      merge: {
        rowSpan: 1,
        columnSpan: 1,
      },
    },
  ]

  const result = mapTabularLayoutCellsToHandsonTableData(tableData)

  expect(result).toBeInstanceOf(HTDataProps)
  expect(result.data).toEqual([['Cell with default spans']])
  expect(result.mergeCells).toEqual([
    new HTMerge(0, 0, 1, 1),
  ])
})

test('creates table with non-contiguous cell positions', () => {
  const tableData = [
    {
      relativePosition: [0, 0],
      content: 'Top Left',
    },
    {
      relativePosition: [2, 2],
      content: 'Bottom Right',
    },
  ]

  const result = mapTabularLayoutCellsToHandsonTableData(tableData)

  expect(result).toBeInstanceOf(HTDataProps)
  expect(result.data).toEqual([
    ['Top Left', null, null],
    [null, null, null],
    [null, null, 'Bottom Right'],
  ])
  expect(result.mergeCells).toEqual([])
})
