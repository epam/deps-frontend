
import { renderHook } from '@testing-library/react-hooks'
import cloneDeep from 'lodash/cloneDeep'
import { PdfSegment, UserPage } from '@/containers/PdfSplitting/models'
import { usePdfSegments } from '../usePdfSegments'
import { useUserPageDnD } from './useUserPageDnD'

jest.mock('../usePdfSegments', () => ({
  usePdfSegments: jest.fn(),
}))

const mockSegmentId1 = 'id'
const mockSegmentId2 = 'id2'
const mockSetSegmentsCallback = jest.fn()

const mockSegments = [
  new PdfSegment({
    id: 'id',
    userPages: [
      new UserPage({
        page: 0,
        segmentId: mockSegmentId1,
      }),
      new UserPage({
        page: 1,
        segmentId: mockSegmentId1,
      }),
    ],
  }),
  new PdfSegment({
    id: mockSegmentId2,
    userPages: [
      new UserPage({
        page: 2,
        segmentId: mockSegmentId2,
      }),
    ],
  }),
]

test('swap userPages correctly inside one segment', () => {
  jest.clearAllMocks()

  const initialSegments = cloneDeep(mockSegments)

  usePdfSegments.mockReturnValueOnce({
    segments: initialSegments,
    setSegments: mockSetSegmentsCallback,
  })

  const { result } = renderHook(() => useUserPageDnD())

  result.current.onUserPageDnD(0, 1)

  expect(mockSetSegmentsCallback).nthCalledWith(1, [
    {
      ...initialSegments[0],
      userPages: [
        initialSegments[0].userPages[1],
        initialSegments[0].userPages[0],
      ],
    },
    initialSegments[1],
  ])
})

test('removes a page from a segment when moves it to another segment', () => {
  jest.clearAllMocks()

  const initialSegments = cloneDeep(mockSegments)

  usePdfSegments.mockReturnValueOnce({
    segments: initialSegments,
    setSegments: mockSetSegmentsCallback,
  })

  const { result } = renderHook(() => useUserPageDnD())

  result.current.onUserPageDnD(1, 2)

  const draggedPage = {
    ...initialSegments[0].userPages[1],
    segmentId: mockSegmentId2,
  }

  expect(mockSetSegmentsCallback).nthCalledWith(1, [
    {
      ...initialSegments[0],
      userPages: [initialSegments[0].userPages[0]],
    },
    {
      ...initialSegments[1],
      userPages: [
        initialSegments[1].userPages[0],
        draggedPage,
      ],
    },
  ])
})

test('removes segment when moves the last page to another segment', () => {
  jest.clearAllMocks()

  const initialSegments = cloneDeep(mockSegments)

  usePdfSegments.mockReturnValueOnce({
    segments: initialSegments,
    setSegments: mockSetSegmentsCallback,
  })

  const { result } = renderHook(() => useUserPageDnD())

  result.current.onUserPageDnD(2, 1)

  const movedUserPage = {
    ...initialSegments[1].userPages[0],
    segmentId: mockSegmentId1,
  }

  expect(mockSetSegmentsCallback).nthCalledWith(1, [
    {
      ...initialSegments[0],
      userPages: [
        initialSegments[0].userPages[0],
        movedUserPage,
        {
          ...initialSegments[0].userPages[1],
        },
      ],
    },
  ])
})
