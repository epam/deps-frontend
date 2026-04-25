
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { ArrowDownFilledIcon } from '@/components/Icons/ArrowDownFilledIcon'
import { LongText } from '@/components/LongText'
import { llModelShape, llmProviderShape } from '@/models/LLMProvider'
import {
  Card,
  ContentWrapper,
  HeaderTitle,
  IconButton,
  Paragraph,
  Provider,
} from './LLMCard.styles'

const CONTENT_ROWS = 2

const LLMCard = ({
  model,
  provider,
  onClick,
  isActive,
  showProviderName,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isButtonVisible, setIsButtonVisible] = useState(false)

  const toggleCollapsed = useCallback((e) => {
    e.stopPropagation()

    setIsExpanded(!isExpanded)
  }, [isExpanded])

  return (
    <Card
      isActive={isActive}
      onClick={() => onClick(model.code, provider.code)}
    >
      <HeaderTitle>
        <LongText text={model.name} />
        {showProviderName && <Provider text={provider.name} />}
      </HeaderTitle>
      <ContentWrapper>
        <Paragraph
          ellipsis={
            !isExpanded && {
              rows: CONTENT_ROWS,
              onEllipsis: (e) => setIsButtonVisible(e),
            }
          }
        >
          {model.description}
        </Paragraph>
        {
          isButtonVisible && (
            <IconButton
              $isExpanded={isExpanded}
              icon={<ArrowDownFilledIcon />}
              onClick={toggleCollapsed}
            />
          )
        }
      </ContentWrapper>
    </Card>
  )
}

LLMCard.propTypes = {
  model: llModelShape.isRequired,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  provider: llmProviderShape,
  showProviderName: PropTypes.bool,
}

export {
  LLMCard,
}
