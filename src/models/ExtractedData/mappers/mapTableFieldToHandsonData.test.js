
import { mockEnv } from '@/mocks/mockEnv'
import {
  HTColumn,
  HTCell,
  HTDataProps,
  HTMerge,
} from '@/components/HandsonTable'
import {
  Cell,
  TableData,
} from '@/models/ExtractedData'
import {
  mapTableFieldToHandsonDataStrings,
  mapTableFieldToHandsonDataObjects,
} from '@/models/ExtractedData/mappers'
import { Rect } from '@/models/Rect'

jest.mock('@/utils/env', () => mockEnv)

describe('mapper: mapTableFieldToHandsonDataStrings', () => {
  const cells = [
    new Cell(0, 0, '0 1', 2, 2),
    new Cell(0, 2, '0 3', 1, 2),
    new Cell(2, 0, '2 1', 1, 1),
    new Cell(2, 1, '2 2', 1, 1),
    new Cell(2, 2, '2 3', 1, 1),
    new Cell(3, 0, 'merged two rows and four columns', 2, 4),
  ]
  const rows = []
  const columns = []
  const tableData = new TableData(1, rows, columns, cells, new Rect(0.1, 0.1, 0.2, 0.2))

  it('should map table field into HTDataProps', () => {
    const mappedData = mapTableFieldToHandsonDataStrings(tableData)

    const data = [
      ['0 1', null, '0 3', null],
      [null, null, null, null],
      ['2 1', '2 2', '2 3', null],
      ['merged two rows and four columns', null, null, null],
      [null, null, null, null],
    ]

    const mergeCells = [
      new HTMerge(0, 0, 2, 2),
      new HTMerge(0, 2, 1, 2),
      new HTMerge(3, 0, 2, 4),
    ]

    const expectedHTDataProps = new HTDataProps(data, mergeCells)

    expect(mappedData).toEqual(expectedHTDataProps)
  })
})

describe('mapper: mapTableFieldToHandsonDataObjects', () => {
  const page = 2

  const cells = [
    new Cell(0, 0, '0 0', 1, 2, page, 0.01),
    new Cell(0, 2, '0 2', 1, 1, page, 0.02),
    new Cell(2, 0, '1 0', 1, 1, page, 0.10),
    new Cell(2, 1, '1 1', 1, 1, page, 0.11),
    new Cell(2, 2, '1 2', 1, 1, page, 0.12),
  ]
  const rows = [{ y: 0 }, { y: 0.5 }]
  const columns = [{ x: 0 }, { x: 0.5 }]
  const tableData = new TableData(1, rows, columns, cells, new Rect(0.1, 0.1, 0.2, 0.2))

  it('should map table field into HTDataProps', () => {
    const mappedData = mapTableFieldToHandsonDataObjects(tableData)

    const data = [
      {
        0: new HTCell('0 0', { confidence: 0.01 }),
        2: new HTCell('0 2', { confidence: 0.02 }),
      },
      {
        0: new HTCell('1 0', { confidence: 0.10 }),
        1: new HTCell('1 1', { confidence: 0.11 }),
        2: new HTCell('1 2', { confidence: 0.12 }),
      },
    ]

    const mergeCells = [
      new HTMerge(0, 0, 1, 2),
    ]

    const columns = [
      new HTColumn('0.value'),
      new HTColumn('1.value'),
      new HTColumn('2.value'),
    ]

    const expectedHTDataProps = new HTDataProps(data, mergeCells, columns)

    expect(mappedData).toEqual(expectedHTDataProps)
  })
})
