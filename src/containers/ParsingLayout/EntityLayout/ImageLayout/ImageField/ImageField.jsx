
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Spin } from '@/components/Spin'
import { Tooltip } from '@/components/Tooltip'
import { InView } from '@/containers/InView'
import { useLayoutMutation } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { imageLayoutShape } from '@/models/DocumentLayout'
import { apiMap } from '@/utils/apiMap'
import { loadImageURL } from '@/utils/image'
import {
  ImageFieldWrapper,
  LongTitle,
  TitleInput,
  Image,
  ImageWrapper,
  ImageBackground,
  DescriptionTextArea,
  DescriptionText,
} from './ImageField.styles'

const TEST_ID = {
  IMAGE: 'image',
  TITLE_LONG_TEXT: 'title-long-text',
  TITLE_INPUT: 'title-input',
  DESCRIPTION_TEXT_AREA: 'description-text-area',
  DESCRIPTION_TEXT: 'description-text',
  IMAGE_FIELD_WRAPPER: 'image-field-wrapper',
}

const getImageUrl = (filePath) => apiMap.apiGatewayV2.v5.file.blob(filePath)

const TEXTAREA_AUTO_SIZE_CONFIG = {
  minRows: 2,
  maxRows: 4,
}

const ImageField = ({
  imageLayout,
  isExpanded,
  onClick,
  pageId,
  parsingType,
}) => {
  const { id, title, filePath, description } = imageLayout

  const [imageSrc, setImageSrc] = useState(null)

  const [isLoading, setIsLoading] = useState(false)

  const [localTitle, setLocalTitle] = useState(title)

  const [localDescription, setLocalDescription] = useState(description)

  const { isEditable, updateImage } = useLayoutMutation(parsingType)

  useEffect(() => {
    setLocalTitle(title)
  }, [title])

  useEffect(() => {
    setLocalDescription(description)
  }, [description])

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true)
        const imageUrl = getImageUrl(filePath)
        const image = await loadImageURL(imageUrl)
        setImageSrc(image.src)
      } finally {
        setIsLoading(false)
      }
    }

    loadImage()
  }, [filePath])

  const handleTitleChange = (e) => {
    setLocalTitle(e.target.value)
  }

  const commitChanges = async (body) => {
    await updateImage({
      pageId,
      imageId: id,
      body,
    })
  }

  const handleTitleBlur = async () => {
    if (localTitle === title) {
      return
    }

    await commitChanges({
      title: localTitle,
    })
  }

  const handleDescriptionChange = (e) => {
    setLocalDescription(e.target.value)
  }

  const handleDescriptionBlur = async () => {
    if (localDescription === description) {
      return
    }

    await commitChanges({
      description: localDescription,
    })
  }

  const onInputClick = (e) => {
    e.stopPropagation()
  }

  const renderTitle = () => {
    if (isEditable && isExpanded) {
      return (
        <TitleInput
          data-testid={TEST_ID.TITLE_INPUT}
          disabled={!isEditable}
          onBlur={handleTitleBlur}
          onChange={handleTitleChange}
          onClick={onInputClick}
          value={localTitle}
        />
      )
    }

    return (
      <LongTitle
        data-testid={TEST_ID.TITLE_LONG_TEXT}
        text={localTitle}
      />
    )
  }

  const renderDescription = () => {
    if (!isExpanded) {
      return null
    }

    if (isEditable) {
      return (
        <DescriptionTextArea
          autoSize={TEXTAREA_AUTO_SIZE_CONFIG}
          data-testid={TEST_ID.DESCRIPTION_TEXT_AREA}
          onBlur={handleDescriptionBlur}
          onChange={handleDescriptionChange}
          onClick={onInputClick}
          value={localDescription}
        />
      )
    }

    return (
      <DescriptionText
        data-testid={TEST_ID.DESCRIPTION_TEXT}
      >
        {localDescription}
      </DescriptionText>
    )
  }

  return (
    <ImageFieldWrapper
      $isExpanded={isExpanded}
      data-testid={TEST_ID.IMAGE_FIELD_WRAPPER}
      onClick={onClick}
    >
      <InView id={id}>
        <Tooltip title={isExpanded ? '' : localDescription}>
          {renderTitle()}
          {renderDescription()}
          <ImageWrapper $isExpanded={isExpanded}>
            {isLoading && <Spin.Centered spinning />}
            <ImageBackground
              backgroundImage={imageSrc}
            />
            <Image
              alt={localTitle}
              data-testid={TEST_ID.IMAGE}
              src={imageSrc}
            />
          </ImageWrapper>
        </Tooltip>
      </InView>
    </ImageFieldWrapper>
  )
}

ImageField.propTypes = {
  imageLayout: imageLayoutShape.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  parsingType: PropTypes.oneOf(
    Object.values(DOCUMENT_LAYOUT_PARSING_TYPE),
  ).isRequired,
}

export {
  ImageField,
}
