
import { mockEnv } from '@/mocks/mockEnv'
import { PdfSegment, UserPage } from '@/containers/PdfSplitting/models'
import { Localization, localize } from '@/localization/i18n'
import { getRangeDescription } from './getRangeDescription'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/PdfSplitting/models', () => ({
  ...jest.requireActual('@/containers/PdfSplitting/models'),
  PdfSegment: {
    getIncludedUserPages: jest.fn(() => mockUserPages),
  },
}))

const mockSegmentId = 'test'

const mockUserPages = [
  new UserPage({
    page: 0,
    segmentId: mockSegmentId,
  }),
  new UserPage({
    page: 1,
    segmentId: mockSegmentId,
  }),
  new UserPage({
    page: 4,
    segmentId: mockSegmentId,
  }),
  new UserPage({
    page: 2,
    segmentId: mockSegmentId,
  }),
  new UserPage({
    page: 3,
    segmentId: mockSegmentId,
  }),
]

const mockSegment = {
  id: mockSegmentId,
  userPages: mockUserPages,
}

test('formats the range and passes it to the localize', () => {
  const result = getRangeDescription(mockSegment)

  expect(PdfSegment.getIncludedUserPages).toHaveBeenCalledWith(mockSegment)

  expect(result).toEqual(localize(Localization.PAGES_RANGE, { range: '1 - 2, 5, 3 - 4' }))
})

test('formats correctly if only one page is in a range', () => {
  PdfSegment.getIncludedUserPages.mockReturnValue([
    new UserPage({
      page: 0,
      segmentId: mockSegmentId,
    }),
  ])

  const result = getRangeDescription(mockSegment)

  expect(result).toBe(localize(Localization.PAGES_RANGE, { range: '1' }))
})

test('handles duplicates in the provided pages', () => {
  PdfSegment.getIncludedUserPages.mockReturnValue([
    ...mockUserPages,
    new UserPage({
      page: 3,
      segmentId: mockSegmentId,
    }),
  ])

  const result = getRangeDescription(mockSegment)

  expect(result).toEqual(localize(Localization.PAGES_RANGE, { range: '1 - 2, 5, 3 - 4' }))
})
