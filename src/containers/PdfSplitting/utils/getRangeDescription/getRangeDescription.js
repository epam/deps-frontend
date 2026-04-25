
import { PdfSegment } from '@/containers/PdfSplitting/models'
import { Localization, localize } from '@/localization/i18n'

const formatPageRanges = (userPages) => {
  const pages = userPages.map((uP) => Number(uP.page))

  const ranges = []

  let start = pages[0]
  let prev = pages[0]

  pages.forEach((page) => {
    if (page === prev || page === prev + 1) {
      prev = page
      return
    }

    ranges.push([start, prev])
    start = prev = page
  })

  ranges.push([start, prev])

  return ranges
    .map(([a, b]) => (a === b ? String(a + 1) : `${a + 1} - ${b + 1}`))
    .join(', ')
}

export const getRangeDescription = (segment) => {
  const availablePages = PdfSegment.getIncludedUserPages(segment)

  return (localize(Localization.PAGES_RANGE, { range: formatPageRanges(availablePages) }))
}
