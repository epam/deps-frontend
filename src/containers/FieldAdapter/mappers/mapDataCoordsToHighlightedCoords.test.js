
import { mockEnv } from '@/mocks/mockEnv'
import { FieldData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { Rect } from '@/models/Rect'
import {
  SourceBboxCoordinates,
  SourceCellCoordinate,
  SourceCellRange,
  SourceCharRange,
  SourceTableCoordinates,
  SourceTextCoordinates,
} from '@/models/SourceCoordinates'
import { TableCoordinates } from '@/models/TableCoordinates'
import { mapDataCoordsToHighlightedCoords } from './mapDataCoordsToHighlightedCoords'

jest.mock('@/utils/env', () => mockEnv)

const mockSourceId = 'c626d5ee3c964e31aaf2e2c7170823ba'
const mockFirstRect = new Rect(1, 2, 3, 4)
const mockSecondRect = new Rect(3, 4, 5, 6)
const mockFirstTableCoords = [1, 2]
const mockSecondTableCoords = [3, 4]
const mockPage = 1

const mockCharRanges = [
  new SourceCharRange(1, 2),
  new SourceCharRange(4, 6),
]

const mockSourceTableCoordinates = [
  new SourceTableCoordinates(
    mockSourceId,
    [
      new SourceCellRange(new SourceCellCoordinate(...mockFirstTableCoords)),
      new SourceCellRange(new SourceCellCoordinate(...mockSecondTableCoords)),
    ],
  ),
]

const mockSourceBboxCoordinates = [
  new SourceBboxCoordinates(
    mockSourceId,
    mockPage,
    [
      mockFirstRect,
      mockSecondRect,
    ],
  ),
]

const mockSourceTextCoordinates = [
  new SourceTextCoordinates(
    mockSourceId,
    mockCharRanges,
  ),
]

describe('Mapper: mapDataCoordsToHighlightedCoords', () => {
  let defaultData

  beforeEach(() => {
    defaultData = new FieldData('Value')
  })

  it('should return correct coords if data contain coordinates', () => {
    defaultData.coordinates = new FieldCoordinates(
      2,
      mockFirstRect.x,
      mockFirstRect.y,
      mockFirstRect.w,
      mockFirstRect.h,
    )

    const returnValue = [
      {
        page: 2,
        coordinates: [mockFirstRect],
      },
    ]

    expect(mapDataCoordsToHighlightedCoords(defaultData)).toEqual(returnValue)
  })

  it('should return correct coords if data contain array of coordinates', () => {
    defaultData.coordinates = [
      new FieldCoordinates(
        2,
        mockFirstRect.x,
        mockFirstRect.y,
        mockFirstRect.w,
        mockFirstRect.h,
      ),
      new FieldCoordinates(
        2,
        mockSecondRect.x,
        mockSecondRect.y,
        mockSecondRect.w,
        mockSecondRect.h,
      ),
    ]

    const returnValue = [
      {
        page: 2,
        coordinates: [mockFirstRect],
      },
      {
        page: 2,
        coordinates: [mockSecondRect],
      },
    ]

    expect(mapDataCoordsToHighlightedCoords(defaultData)).toEqual(returnValue)
  })

  it('should return correct coords if data contain tableCoordinates', () => {
    defaultData.tableCoordinates = [
      new TableCoordinates(
        1,
        [mockFirstTableCoords, mockSecondTableCoords],
      ),
    ]

    const returnValue = [
      {
        page: 1,
        coordinates: [mockFirstTableCoords, mockSecondTableCoords],
      },
    ]

    expect(mapDataCoordsToHighlightedCoords(defaultData)).toEqual(returnValue)
  })

  it('should return correct coords if data contain sourceTableCoordinates', () => {
    defaultData.sourceTableCoordinates = mockSourceTableCoordinates

    const returnValue = [
      {
        sourceId: mockSourceId,
        coordinates: [mockFirstTableCoords, mockSecondTableCoords],
      },
    ]

    expect(mapDataCoordsToHighlightedCoords(defaultData)).toEqual(returnValue)
  })

  it('should return correct coords if data contain sourceBboxCoordinates', () => {
    defaultData.sourceBboxCoordinates = mockSourceBboxCoordinates

    const returnValue = [
      {
        sourceId: mockSourceId,
        coordinates: [mockFirstRect, mockSecondRect],
      },
    ]

    expect(mapDataCoordsToHighlightedCoords(defaultData)).toEqual(returnValue)
  })

  it('should return correct coords if data contain single sourceBboxCoordinate', () => {
    defaultData.sourceBboxCoordinates = mockSourceBboxCoordinates[0]

    const returnValue = [
      {
        sourceId: mockSourceId,
        coordinates: [mockFirstRect, mockSecondRect],
      },
    ]

    expect(mapDataCoordsToHighlightedCoords(defaultData)).toEqual(returnValue)
  })

  it('should return correct coords if data contain sourceTextCoordinates', () => {
    defaultData.sourceTextCoordinates = mockSourceTextCoordinates

    const returnValue = [
      {
        sourceId: mockSourceId,
        coordinates: mockCharRanges,
      },
    ]

    expect(mapDataCoordsToHighlightedCoords(defaultData)).toEqual(returnValue)
  })
})
