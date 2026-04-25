
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Canvas } from '@/components/ImageViewer/Canvas'
import { UiKeys } from '@/constants/navigation'
import { slateAttributesShape, slateImageElementShape } from '@/containers/Slate/models'
import { Cursor } from '@/enums/Cursor'
import { highlightedPolygonCoordsShape } from '@/models/HighlightedField'
import { uiSelector } from '@/selectors/navigation'
import { highlightedFieldSelector } from '@/selectors/reviewPage'
import { apiMap } from '@/utils/apiMap'

const Image = ({
  attributes,
  element,
  highlightedField,
  activeSourceId,
}) => {
  const imageUrl = apiMap.apiGatewayV2.v5.file.blob(element.url)
  const [imageSize, setImageSize] = useState({
    width: null,
    height: null,
  })

  useEffect(() => {
    if (!attributes.ref.current) {
      return
    }

    const {
      width: imageWidth,
      height: imageHeight,
    } = element.attributes
    const parentWidth = attributes.ref.current.parentNode.getBoundingClientRect().width
    const ratio = imageWidth / imageHeight
    const width = imageWidth >= parentWidth
      ? parentWidth
      : imageWidth

    setImageSize({
      width,
      height: width / ratio,
    })
  }, [attributes, element])

  const getPolygons = () => {
    if (element.id !== activeSourceId) {
      return []
    }

    attributes.ref.current?.scrollIntoView()

    return highlightedField
  }

  return (
    <div ref={attributes.ref}>
      <Canvas
        cursor={Cursor.DEFAULT}
        imageUrl={imageUrl}
        polygons={getPolygons()}
        {...imageSize}
      />
    </div>
  )
}

Image.propTypes = {
  attributes: slateAttributesShape,
  element: slateImageElementShape.isRequired,
  highlightedField: highlightedPolygonCoordsShape,
  activeSourceId: PropTypes.string,
}

const mapStateToProps = (state) => ({
  activeSourceId: uiSelector(state)[UiKeys.ACTIVE_SOURCE_ID],
  highlightedField: highlightedFieldSelector(state),
})

const ConnectedComponent = connect(mapStateToProps)(Image)

export { ConnectedComponent as Image }
