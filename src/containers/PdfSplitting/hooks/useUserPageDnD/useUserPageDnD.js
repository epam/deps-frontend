
import { useCallback } from 'react'
import { PdfSegment } from '@/containers/PdfSplitting/models'
import { usePdfSegments } from '../usePdfSegments'

export const useUserPageDnD = () => {
  const { segments, setSegments } = usePdfSegments()

  const onUserPageDnD = useCallback((fromIndex, toIndex) => {
    const flatPages = segments.flatMap((s) => s.userPages)

    const draggedPage = flatPages[fromIndex]
    const targetPage = flatPages[toIndex]

    const fromSegment = segments.find((segment) => segment.id === draggedPage.segmentId)
    const toSegment = segments.find((segment) => segment.id === targetPage.segmentId)

    const insertBefore = fromIndex > toIndex

    if (fromSegment === toSegment) {
      const draggedPageIndex = fromSegment.userPages.indexOf(draggedPage)
      const targetPageIndex = fromSegment.userPages.indexOf(targetPage)

      const updatedSegment = PdfSegment.swapUserPages(
        fromSegment,
        targetPageIndex,
        draggedPageIndex,
      )

      const newSegments = segments.map((segment) =>
        segment === fromSegment ? updatedSegment : segment,
      )
      setSegments(newSegments)

      return
    }

    const updatedToSegment = PdfSegment.insertUserPageToAnchor({
      segment: toSegment,
      anchorPage: targetPage,
      draggedPage,
      insertBefore,
    })

    const newSegments = segments.reduce((result, segment) => {
      if (segment === toSegment) {
        return [...result, updatedToSegment]
      }

      if (segment === fromSegment) {
        const updatedFromSegment = PdfSegment.removePageFromSegment(segment, draggedPage)

        return PdfSegment.isValid(updatedFromSegment)
          ? [...result, updatedFromSegment]
          : result
      }

      return [...result, segment]
    }, [])

    setSegments(newSegments)
  }, [segments, setSegments])

  return { onUserPageDnD }
}
