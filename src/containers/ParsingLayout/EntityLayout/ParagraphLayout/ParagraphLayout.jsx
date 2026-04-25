
import PropTypes from 'prop-types'
import {
  useCallback,
  useState,
} from 'react'
import { DOCUMENT_LAYOUT_FEATURE, DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { InfiniteScrollLayout } from '../InfiniteScrollLayout'
import { LocalErrorBoundary } from '../LocalErrorBoundary'
import { ParagraphField } from './ParagraphField'

const ParagraphLayout = ({
  parsingType,
  total,
}) => {
  const [layoutData, setLayoutData] = useState([])

  const setLayout = useCallback((layoutData) =>
    setLayoutData((data) => [...data, ...layoutData]),
  [])

  return (
    <InfiniteScrollLayout
      parsingFeature={DOCUMENT_LAYOUT_FEATURE.TEXT}
      parsingType={parsingType}
      setLayout={setLayout}
      showEmpty={!layoutData.length}
      total={total}
    >
      {
        layoutData.map(({ page, pageId, layout }, index) => (
          <LocalErrorBoundary key={index}>
            <ParagraphField
              page={page}
              pageId={pageId}
              paragraph={layout}
              parsingType={parsingType}
            />
          </LocalErrorBoundary>
        ))
      }
    </InfiniteScrollLayout>
  )
}

ParagraphLayout.propTypes = {
  parsingType: PropTypes.oneOf(
    Object.values(DOCUMENT_LAYOUT_PARSING_TYPE),
  ).isRequired,
  total: PropTypes.number.isRequired,
}

export { ParagraphLayout }
