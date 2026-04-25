
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { Button } from '@/components/Button'
import { FeatureControl } from '@/components/FeatureControl'
import { BrightnessIcon } from '@/components/Icons/BrightnessIcon'
import { ContrastIcon } from '@/components/Icons/ContrastIcon'
import { LabelIcon } from '@/components/Icons/LabelIcon'
import { LabelingIcon } from '@/components/Icons/LabelingIcon'
import { MarkupIcon } from '@/components/Icons/MarkupIcon'
import { RotateLeftIcon } from '@/components/Icons/RotateLeftIcon'
import { RotateRightIcon } from '@/components/Icons/RotateRightIcon'
import { FeatureNames } from '@/enums/FeatureNames'
import { localize, Localization } from '@/localization/i18n'
import { pointShape } from '@/models/Point'
import {
  RelativeWrapper,
  Controls,
  LeftControls,
  RightControls,
  ImageViewerContainer,
  NoData,
  CommandsSeparator,
  Slider,
} from './ImageViewer.styles'
import { ResizableCanvas } from './ResizableCanvas'
import { WindowCanvas } from './WindowCanvas'

const MAX_SCALE = 600
const MIN_SCALE = 50
const SCALE_STEP = 10

const ImageViewer = ({
  activePolygons,
  scaling = false,
  isFixedSize = false,
  renderOverlay = (canvas) => canvas,
  renderPageSwitcher,
  fetching,
  imageUrl,
  onAddActivePolygons,
  onClearActivePolygons,
  onRotate,
  polygons,
}) => {
  const [rotationAngle, setRotationAngle] = useState(0)
  const [scaleFactor, setScaleFactor] = useState(100)

  const onRotateLeft = useCallback((e) => {
    e.preventDefault()
    const newRotationAngle = (rotationAngle - 90) % 360
    onRotate && onRotate(newRotationAngle)
    setRotationAngle(newRotationAngle)
  }, [rotationAngle, onRotate])

  const onRotateRight = useCallback((e) => {
    e.preventDefault()
    const newRotationAngle = (rotationAngle + 90) % 360
    onRotate && onRotate(newRotationAngle)
    setRotationAngle(newRotationAngle)
  }, [rotationAngle, onRotate])

  const getScaleConfig = (inPercents = true) => {
    const getValue = (val) => inPercents ? val : val / 100
    const onScaleChange = (val) => setScaleFactor(
      inPercents ? val : val * 100,
    )
    return {
      max: getValue(MAX_SCALE),
      min: getValue(MIN_SCALE),
      onChange: onScaleChange,
      step: getValue(SCALE_STEP),
      value: getValue(scaleFactor),
    }
  }

  if (!imageUrl && !fetching) {
    return <NoData>{localize(Localization.NO_DATA)}</NoData>
  }

  return (
    <ImageViewerContainer>
      <Controls>
        <LeftControls>
          <FeatureControl featureName={FeatureNames.SHOW_NOT_IMPLEMENTED}>
            <Button.Icon
              icon={<MarkupIcon />}
            />
            <Button.Icon
              icon={<LabelingIcon />}
            />
            <Button.Icon
              icon={<LabelIcon />}
            />
            <CommandsSeparator />
            <Button.Icon
              icon={<ContrastIcon />}
            />
            <Button.Icon
              icon={<BrightnessIcon />}
            />
            <CommandsSeparator />
          </FeatureControl>
          <Button.Icon
            disabled={!imageUrl}
            icon={<RotateLeftIcon />}
            onClick={onRotateLeft}
          />
          <Button.Icon
            disabled={!imageUrl}
            icon={<RotateRightIcon />}
            onClick={onRotateRight}
          />
          <CommandsSeparator />
          {
            scaling && (
              <Slider
                disabled={!imageUrl}
                valuePrefix={'%'}
                {...getScaleConfig()}
              />
            )
          }
          <CommandsSeparator />
        </LeftControls>
        <RightControls>
          {renderPageSwitcher && renderPageSwitcher()}
        </RightControls>
      </Controls>
      {
        isFixedSize
          ? (
            <RelativeWrapper>
              {
                renderOverlay(
                  <WindowCanvas
                    activePolygons={activePolygons}
                    imageUrl={imageUrl}
                    onAddActivePolygons={onAddActivePolygons}
                    onClearActivePolygons={onClearActivePolygons}
                    polygons={polygons}
                    rotationAngle={rotationAngle}
                  />,
                )
              }
            </RelativeWrapper>
          )
          : (
            <ResizableCanvas
              activePolygons={activePolygons}
              imageUrl={imageUrl}
              onAddActivePolygons={onAddActivePolygons}
              onClearActivePolygons={onClearActivePolygons}
              polygons={polygons}
              rotationAngle={rotationAngle}
              scaleConfig={getScaleConfig(false)}
              scalingToPointFeature
            />
          )
      }
    </ImageViewerContainer>
  )
}

ImageViewer.propTypes = {
  activePolygons: PropTypes.arrayOf(
    PropTypes.arrayOf(pointShape),
  ),
  renderOverlay: PropTypes.func,
  imageUrl: PropTypes.string.isRequired,
  fetching: PropTypes.bool,
  isFixedSize: PropTypes.bool,
  onAddActivePolygons: PropTypes.func,
  onClearActivePolygons: PropTypes.func,
  scaling: PropTypes.bool,
  polygons: PropTypes.arrayOf(
    PropTypes.arrayOf(pointShape),
  ),
  onRotate: PropTypes.func,
  renderPageSwitcher: PropTypes.func,
}

export {
  ImageViewer,
}
