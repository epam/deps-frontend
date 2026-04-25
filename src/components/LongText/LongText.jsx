
import PropTypes from 'prop-types'
import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { Tooltip } from '@/components/Tooltip'
import {
  Text,
  Wrapper,
  MultilineText,
} from './LongText.styles'

const LongText = ({
  text,
  shouldHideTooltip,
  ...restProps
}) => {
  const [overflowActive, setOverflowActive] = useState(false)
  const textRef = useRef()

  const isOverflowActive = useCallback((text) => {
    return text.offsetWidth < text.scrollWidth
  }, [])

  useEffect(() => {
    if (isOverflowActive(textRef.current)) {
      setOverflowActive(true)
    }
  }, [isOverflowActive])

  const renderTooltip = (children) => (
    <Wrapper>
      <Tooltip
        title={
          (
            <MultilineText>
              {text}
            </MultilineText>
          )
        }
      >
        {children}
      </Tooltip>
    </Wrapper>
  )

  const TextWrapper = useMemo(() => (
    <Text
      ref={textRef}
      {...restProps}
    >
      {text}
    </Text>
  ), [text, restProps])

  return (
    overflowActive && !shouldHideTooltip
      ? renderTooltip(TextWrapper)
      : TextWrapper
  )
}

LongText.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
      ]),
    ),
  ]),
  shouldHideTooltip: PropTypes.bool,
}

export {
  LongText,
}
