
import PropTypes from 'prop-types'
import {
  useCallback,
  useState,
} from 'react'
import { useHighlightCoords } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_FEATURE, DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { InfiniteScrollLayout } from '../InfiniteScrollLayout'
import { LocalErrorBoundary } from '../LocalErrorBoundary'
import { ImageField } from './ImageField'
import { ImagesFieldContainer } from './ImageLayout.styles'

const ImageLayout = ({
  parsingType,
  total,
}) => {
  const [expandedImageId, setExpandedImageId] = useState(null)
  const [layoutData, setLayoutData] = useState([])

  const { highlightCoords, unhighlightCoords } = useHighlightCoords()

  const setLayout = useCallback((layoutData) =>
    setLayoutData((data) => [...data, ...layoutData]),
  [])

  const highlightImageCoords = (polygon, page) => {
    highlightCoords({
      field: [polygon],
      page,
    })
  }

  const handleImageClick = (imageId, polygon, page) => {
    const newExpandedId = expandedImageId === imageId ? null : imageId
    const shouldExpand = newExpandedId === imageId

    setExpandedImageId(newExpandedId)
    shouldExpand ? highlightImageCoords(polygon, page) : unhighlightCoords()
  }

  return (
    <ImagesFieldContainer>
      <InfiniteScrollLayout
        parsingFeature={DOCUMENT_LAYOUT_FEATURE.IMAGES}
        parsingType={parsingType}
        setLayout={setLayout}
        showEmpty={!layoutData.length}
        total={total}
      >
        {
          layoutData.map(({ page, pageId, layout }) => {
            const { id, polygon } = layout
            return (
              <LocalErrorBoundary key={id}>
                <ImageField
                  key={id}
                  imageLayout={layout}
                  isExpanded={expandedImageId === id}
                  onClick={() => handleImageClick(id, polygon, page)}
                  pageId={pageId}
                  parsingType={parsingType}
                />
              </LocalErrorBoundary>
            )
          })
        }
      </InfiniteScrollLayout>
    </ImagesFieldContainer>
  )
}

ImageLayout.propTypes = {
  parsingType: PropTypes.oneOf(
    Object.values(DOCUMENT_LAYOUT_PARSING_TYPE),
  ).isRequired,
  total: PropTypes.number.isRequired,
}

export { ImageLayout }
