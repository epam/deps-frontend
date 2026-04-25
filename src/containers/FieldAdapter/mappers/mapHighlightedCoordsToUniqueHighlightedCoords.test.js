
import { Rect } from '@/models/Rect'
import { mapHighlightedCoordsToUniqueHighlightedCoords } from './mapHighlightedCoordsToUniqueHighlightedCoords'

const mockFirstSourceId = 'mockFirstSourceId'
const mockSecondSourceId = 'mockSecondSourceId'
const mockFirstRect = new Rect(1, 2, 3, 4)
const mockSecondRect = new Rect(3, 4, 5, 6)

const mockHighlightedSourceCoords = [
  {
    sourceId: mockFirstSourceId,
    coordinates: [
      mockFirstRect,
    ],
  },
  {
    sourceId: mockFirstSourceId,
    coordinates: [
      mockSecondRect,
    ],
  },
  {
    sourceId: mockSecondSourceId,
    coordinates: [
      mockSecondRect,
    ],
  },
]

const mockHighlightedCoords = [
  {
    page: 1,
    coordinates: [
      mockFirstRect,
    ],
  },
  {
    page: 1,
    coordinates: [
      mockSecondRect,
    ],
  },
  {
    page: 2,
    coordinates: [
      mockSecondRect,
    ],
  },
]

describe('Mapper: mapHighlightedCoordsToUniqueHighlightedCoords', () => {
  it('should return correct coords from sourceCoordinates', () => {
    const returnValue = [
      {
        sourceId: mockFirstSourceId,
        coordinates: [mockFirstRect, mockSecondRect],
      },
      {
        sourceId: mockSecondSourceId,
        coordinates: [mockSecondRect],
      },
    ]

    const mappedCoords = mapHighlightedCoordsToUniqueHighlightedCoords(mockHighlightedSourceCoords)
    expect(mappedCoords).toEqual(returnValue)
  })

  it('should return correct coords from coordinates', () => {
    const returnValue = [
      {
        page: 1,
        coordinates: [mockFirstRect, mockSecondRect],
      },
      {
        page: 2,
        coordinates: [mockSecondRect],
      },
    ]

    const mappedCoords = mapHighlightedCoordsToUniqueHighlightedCoords(mockHighlightedCoords)
    expect(mappedCoords).toEqual(returnValue)
  })
})
