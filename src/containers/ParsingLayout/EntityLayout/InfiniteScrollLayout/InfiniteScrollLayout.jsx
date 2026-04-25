
import PropTypes from 'prop-types'
import { useCallback, useState, useEffect } from 'react'
import { NoData } from '@/components/NoData'
import { useFetchLayout } from '@/containers/ParsingLayout/EntityLayout/hooks'
import {
  DOCUMENT_LAYOUT_FEATURE,
  DOCUMENT_LAYOUT_FEATURE_TO_LAYOUT_TYPE,
  DOCUMENT_LAYOUT_PARSING_TYPE,
} from '@/enums/DocumentLayoutType'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { childrenShape } from '@/utils/propTypes'
import { InfiniteScroll, Spinner } from './InfiniteScrollLayout.styles'
import { mapDocumentLayoutPagesToLayouts } from './mapDocumentLayoutPagesToLayouts'

const INITIAL_BATCH_INDEX = 0
const BATCH_SIZE = 1
const BATCH_INDEX_STEP = 1

const TEST_ID = {
  SPIN: 'spin',
  INFINITE_SCROLL: 'infinite-scroll',
}

const InfiniteScrollLayout = ({
  children,
  setLayout,
  parsingFeature,
  parsingType,
  showEmpty,
  total,
}) => {
  const [batchIndex, setBatchIndex] = useState(INITIAL_BATCH_INDEX)
  const [lastProcessedBatchIndex, setLastProcessedBatchIndex] = useState(null)

  const {
    data: layoutBatch,
    isFetching: isLayoutFetching,
    isError: isLayoutError,
  } = useFetchLayout({
    parsingFeature,
    parsingType,
    batchIndex,
    batchSize: BATCH_SIZE,
  })

  useEffect(() => {
    if (isLayoutError) {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  }, [isLayoutError])

  useEffect(() => {
    if (
      isLayoutFetching ||
      !layoutBatch ||
      lastProcessedBatchIndex === batchIndex
    ) {
      return
    }

    const documentLayoutType = DOCUMENT_LAYOUT_FEATURE_TO_LAYOUT_TYPE[parsingFeature]

    const layoutChunk = mapDocumentLayoutPagesToLayouts(layoutBatch)[documentLayoutType]

    if (layoutChunk && layoutChunk.length) {
      setLayout(layoutChunk)
    }

    setLastProcessedBatchIndex(batchIndex)
  }, [
    isLayoutFetching,
    layoutBatch,
    parsingFeature,
    setLayout,
    batchIndex,
    lastProcessedBatchIndex,
  ])

  const loadMore = useCallback(() => {
    const currentBatchIndex = lastProcessedBatchIndex ?? -1
    const newBatchIndex = currentBatchIndex + BATCH_INDEX_STEP

    if (newBatchIndex >= total) {
      return
    }

    setBatchIndex(newBatchIndex)
  }, [
    total,
    lastProcessedBatchIndex,
  ])

  if (
    showEmpty &&
    lastProcessedBatchIndex !== null &&
    (lastProcessedBatchIndex + BATCH_INDEX_STEP) === total
  ) {
    return (
      <NoData
        description={localize(Localization.NO_DATA)}
      />
    )
  }

  return (
    <>
      {children}
      {
        isLayoutFetching
          ? (
            <Spinner
              data-testid={TEST_ID.SPIN}
              spinning={isLayoutFetching}
            />
          )
          : (
            <InfiniteScroll
              data-testid={TEST_ID.INFINITE_SCROLL}
              loadMore={loadMore}
            />
          )
      }
    </>
  )
}

InfiniteScrollLayout.propTypes = {
  children: childrenShape.isRequired,
  setLayout: PropTypes.func.isRequired,
  showEmpty: PropTypes.bool.isRequired,
  parsingFeature: PropTypes.oneOf(
    Object.values(DOCUMENT_LAYOUT_FEATURE),
  ).isRequired,
  parsingType: PropTypes.oneOf(
    Object.values(DOCUMENT_LAYOUT_PARSING_TYPE),
  ).isRequired,
  total: PropTypes.number.isRequired,
}

export {
  InfiniteScrollLayout,
  TEST_ID,
}
