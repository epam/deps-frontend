
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useHighlightCoords, useLayoutMutation } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import {
  LineLayout as LineModel,
  lineLayoutShape,
} from '@/models/DocumentLayout'
import { StyledLineInput, LineWrapper } from './LineLayout.styles'

const TEST_ID = {
  LINE_INPUT: 'line-input',
  LINE_WRAPPER: 'line-wrapper',
}

const LineLayout = ({
  page,
  line,
  paragraphId,
  pageId,
  parsingType,
}) => {
  const [content, setContent] = useState(line.content)

  const { highlightCoords } = useHighlightCoords()

  const { isEditable, updateParagraph } = useLayoutMutation(parsingType)

  useEffect(() => {
    setContent(line.content)
  }, [line.content])

  const onTextAreaClick = () => {
    if (!line.polygon.length) {
      return
    }

    highlightCoords({
      field: [line.polygon],
      page,
    })
  }

  const onBlurInput = async () => {
    if (content === line.content) {
      return
    }

    await updateParagraph({
      pageId,
      paragraphId: paragraphId,
      body: {
        lines: [
          new LineModel({
            order: line.order,
            content,
          }),
        ],
      },
    })
  }

  const onChangeInput = (e) => {
    setContent(e.target.value)
  }

  if (!isEditable) {
    return (
      <LineWrapper
        data-testid={TEST_ID.LINE_WRAPPER}
        onClick={onTextAreaClick}
      >
        {line.content}
      </LineWrapper>
    )
  }

  return (
    <StyledLineInput
      data-testid={TEST_ID.LINE_INPUT}
      onBlur={onBlurInput}
      onChange={onChangeInput}
      onClick={onTextAreaClick}
      value={content}
    />
  )
}

LineLayout.propTypes = {
  line: lineLayoutShape.isRequired,
  page: PropTypes.number.isRequired,
  pageId: PropTypes.string.isRequired,
  paragraphId: PropTypes.string.isRequired,
  parsingType: PropTypes.oneOf(
    Object.values(DOCUMENT_LAYOUT_PARSING_TYPE),
  ).isRequired,
}

export { LineLayout }
