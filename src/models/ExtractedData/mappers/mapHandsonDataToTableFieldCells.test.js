
import { mockEnv } from '@/mocks/mockEnv'
import { HTCell, HTMerge } from '@/components/HandsonTable'
import { Cell } from '@/models/ExtractedData'
import {
  mapHandsonDataStringsToTableFieldCells,
  mapHandsonDataObjectsToTableFieldCells,
} from '@/models/ExtractedData/mappers'
import { TableCoordinates } from '@/models/TableCoordinates'

jest.mock('@/utils/env', () => mockEnv)

describe('mapper: mapHandsonDataStringsToTableFieldCells', () => {
  const tableData = [
    ['0 1', null, '0 3'],
    [null, null, null],
    ['2 1', '2 2', '2 3'],
  ]

  const mergeCells = [
    new HTMerge(0, 0, 2, 2),
    new HTMerge(0, 2, 1, 2),
  ]

  const page = 1

  it('should map handsontable table data with merged cells into table field cells', () => {
    const cells = mapHandsonDataStringsToTableFieldCells(tableData, mergeCells, page)
    const expectedTableFieldCells = [
      new Cell(0, 0, '0 1', 2, 2, page),
      new Cell(0, 2, '0 3', 1, 2, page),
      new Cell(2, 0, '2 1', 1, 1, page),
      new Cell(2, 1, '2 2', 1, 1, page),
      new Cell(2, 2, '2 3', 1, 1, page),
    ]

    expect(cells).toEqual(expectedTableFieldCells)
  })
})

describe('mapper: mapHandsonDataObjectsToTableFieldCells', () => {
  const tableData = [
    {
      0: new HTCell('0 0', {
        confidence: 0.01,
        tableCoordinates: new TableCoordinates(1, [1, 1]),
      }),
      2: new HTCell('0 2', {
        confidence: 0.02,
        tableCoordinates: new TableCoordinates(1, [2, 2]),
      }),
    },
    {
      0: new HTCell('1 0', {
        confidence: 0.10,
        tableCoordinates: new TableCoordinates(1, [3, 3]),
      }),
      1: new HTCell('1 1', {
        confidence: 0.11,
        tableCoordinates: new TableCoordinates(1, [4, 4]),
      }),
      2: new HTCell('1 2', {
        confidence: 0.12,
        tableCoordinates: new TableCoordinates(1, [5, 5]),
      }),
    },
  ]

  const mergeCells = [
    new HTMerge(0, 0, 1, 2),
  ]

  const page = 2

  it('should map handsontable table data with merged cells into table field cells', () => {
    const cells = mapHandsonDataObjectsToTableFieldCells(tableData, mergeCells, page)
    const expectedTableFieldCells = [
      new Cell(0, 0, '0 0', 1, 2, page, 0.01, new TableCoordinates(1, [1, 1])),
      new Cell(0, 2, '0 2', 1, 1, page, 0.02, new TableCoordinates(1, [2, 2])),
      new Cell(1, 0, '1 0', 1, 1, page, 0.10, new TableCoordinates(1, [3, 3])),
      new Cell(1, 1, '1 1', 1, 1, page, 0.11, new TableCoordinates(1, [4, 4])),
      new Cell(1, 2, '1 2', 1, 1, page, 0.12, new TableCoordinates(1, [5, 5])),
    ]

    expect(cells).toEqual(expectedTableFieldCells)
  })
})
