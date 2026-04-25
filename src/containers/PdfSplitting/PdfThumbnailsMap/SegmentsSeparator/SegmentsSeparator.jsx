
import { useCallback, useMemo } from 'react'
import { usePdfSegments } from '@/containers/PdfSplitting/hooks'
import {
  PdfSegment,
  userPageShape,
} from '@/containers/PdfSplitting/models'
import {
  Separator,
  SeparatorContainer,
  StyledLockIcon,
  StyledScissorsIcon,
} from './SegmentsSeparator.styles'

export const SegmentsSeparator = ({ userPage }) => {
  const {
    segments,
    setSegments,
    activeUserPage,
    updateActiveUserPage,
  } = usePdfSegments()

  const isSegmentBorder = useCallback((userPage) => {
    const segment = segments.find((s) => s.userPages.includes(userPage))
    const segmentPageIndex = segment.userPages.indexOf(userPage)
    return segmentPageIndex === 0
  }, [segments])

  const splitSegments = useCallback((userPage) => {
    const segment = segments.find((s) => s.userPages.includes(userPage))

    const newSegments = segments.map((s) => {
      if (s === segment) {
        return PdfSegment.split(segment, userPage)
      }

      return s
    }).flat()

    setSegments(newSegments)

    activeUserPage &&
    updateActiveUserPage(newSegments.flatMap((s) => s.userPages))
  }, [
    segments,
    setSegments,
    activeUserPage,
    updateActiveUserPage,
  ])

  const mergeSegments = useCallback((userPage) => {
    const segmentIndex = segments.findIndex((s) => s.userPages.includes(userPage))
    const segment = segments[segmentIndex]
    const previousSegment = segments[segmentIndex - 1]
    const newSegments = segments.reduce((a, c) => {
      if (c === previousSegment) {
        return a
      }

      if (c === segment) {
        return [
          ...a,
          PdfSegment.merge(previousSegment, segment),
        ]
      }

      return [...a, c]
    }, [])

    setSegments(newSegments)

    activeUserPage &&
    updateActiveUserPage(newSegments.flatMap((s) => s.userPages))
  }, [
    segments,
    setSegments,
    activeUserPage,
    updateActiveUserPage,
  ])

  const onSeparatorClick = useCallback((userPage) => () => {
    if (!isSegmentBorder(userPage)) {
      return splitSegments(userPage)
    }

    return mergeSegments(userPage)
  }, [
    isSegmentBorder,
    mergeSegments,
    splitSegments,
  ])

  const isBorderDisabled = useMemo(() => {
    const segment = segments.find((s) => s.userPages.includes(userPage))
    const indexOfUserPage = segment.userPages.indexOf(userPage)

    const pagesToTheLeft = segment.userPages.slice(0, indexOfUserPage)
    const pagesToTheRight = segment.userPages.slice(indexOfUserPage)

    const areUserPagesExcludedToTheLeft = !!pagesToTheLeft.length && pagesToTheLeft.every((uP) => uP.isExcluded)
    const areUserPagesExcludedToTheRight = !!pagesToTheRight.length && pagesToTheRight.every((uP) => uP.isExcluded)

    return areUserPagesExcludedToTheLeft || areUserPagesExcludedToTheRight
  }, [segments, userPage])

  return (
    <SeparatorContainer
      $isActive={isSegmentBorder(userPage)}
      disabled={isBorderDisabled}
      onClick={onSeparatorClick(userPage)}
    >
      {
        isBorderDisabled ? <StyledLockIcon /> : <StyledScissorsIcon />
      }
      <Separator />
    </SeparatorContainer>
  )
}

SegmentsSeparator.propTypes = {
  userPage: userPageShape.isRequired,
}
