
import PropTypes from 'prop-types'
import {
  useCallback,
  useState,
} from 'react'
import { DOCUMENT_LAYOUT_FEATURE, DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { InfiniteScrollLayout } from '../InfiniteScrollLayout'
import { LocalErrorBoundary } from '../LocalErrorBoundary'
import { KeyValuePairField } from './KeyValuePairField'
import { Wrapper } from './KeyValuePairLayout.styles'

const KeyValuePairLayout = ({
  parsingType,
  total,
}) => {
  const [layoutData, setLayoutData] = useState([])

  const setLayout = useCallback((layoutData) =>
    setLayoutData((data) => [...data, ...layoutData]),
  [])

  return (
    <Wrapper>
      <InfiniteScrollLayout
        parsingFeature={DOCUMENT_LAYOUT_FEATURE.KEY_VALUE_PAIRS}
        parsingType={parsingType}
        setLayout={setLayout}
        showEmpty={!layoutData.length}
        total={total}
      >
        {
          layoutData.map(({ page, pageId, layout }, index) => (
            <LocalErrorBoundary key={index}>
              <KeyValuePairField
                keyData={layout.key}
                keyValuePairId={layout.id}
                page={page}
                pageId={pageId}
                parsingType={parsingType}
                valueData={layout.value}
              />
            </LocalErrorBoundary>
          ))
        }
      </InfiniteScrollLayout>
    </Wrapper>
  )
}

KeyValuePairLayout.propTypes = {
  parsingType: PropTypes.oneOf(
    Object.values(DOCUMENT_LAYOUT_PARSING_TYPE),
  ).isRequired,
  total: PropTypes.number.isRequired,
}

export {
  KeyValuePairLayout,
}
