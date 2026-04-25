
import React, {
  useState,
  useEffect,
  useCallback,
} from 'react'
import { ArrowDownFilledIcon } from '@/components/Icons/ArrowDownFilledIcon'
import { useMutationObserver } from '@/hooks/useMutationObserver'
import { useStateRef } from '@/hooks/useStateRef'
import { getComputedStyle } from '@/utils/getComputedStyle'
import { WrapperArrowIcon, ExpandableTextWrapper } from './ExpandableText.styles'

const DEFAULT_ROWS_QUANTITY = 3

const getElementContent = (target) => {
  if (!target) {
    return ''
  }

  if (typeof target.value === 'string') {
    return target.value
  }

  return target.textContent || ''
}

const useExpandableText = (rowsQuantity = DEFAULT_ROWS_QUANTITY) => {
  const [isFieldExpanded, setIsFieldExpanded] = useState(false)
  const [isIconVisible, setIsIconVisible] = useState(true)
  const [element, refCallback] = useStateRef()
  const [textAreaValue, setTextAreaValue] = useState()

  const handleMutation = useCallback((entries = []) => {
    const lastEntry = entries[entries.length - 1]

    if (!lastEntry?.target) {
      return
    }

    setTextAreaValue(getElementContent(lastEntry.target))
  }, [])

  useMutationObserver(element?.firstChild, handleMutation)

  useEffect(() => {
    if (!element) {
      return
    }

    const contentElement = element.firstChild

    const currentRowsHeight = getComputedStyle(contentElement, 'line-height') * rowsQuantity +
      getComputedStyle(contentElement, 'padding-bottom') +
      getComputedStyle(contentElement, 'padding-top')

    contentElement.style.height = 0

    if (currentRowsHeight < contentElement.scrollHeight) {
      contentElement.style.height = `${currentRowsHeight}px`
      contentElement.style.overflowY = 'scroll'
    } else {
      contentElement.style.overflowY = 'hidden'
      contentElement.style.height = `${contentElement.scrollHeight}px`
      setIsFieldExpanded(false)
    }

    if (isFieldExpanded) {
      contentElement.style.height = `${contentElement.scrollHeight}px`
      contentElement.style.overflowY = 'scroll'
    }

    setIsIconVisible(currentRowsHeight < contentElement.scrollHeight)
  }, [
    isFieldExpanded,
    element,
    textAreaValue,
    rowsQuantity,
  ])

  const toggleExpand = useCallback(() => setIsFieldExpanded((prev) => !prev), [])

  const ToggleExpandIcon = useCallback(() => (
    isIconVisible && (
      <WrapperArrowIcon
        $isRotated={isFieldExpanded}
        onClick={toggleExpand}
      >
        <ArrowDownFilledIcon />
      </WrapperArrowIcon>
    )
  ), [isIconVisible, isFieldExpanded, toggleExpand])

  const ExpandableContainer = useCallback(({ children }) => (
    <ExpandableTextWrapper ref={refCallback}>
      {children}
    </ExpandableTextWrapper>
  ), [refCallback])

  return {
    ExpandableContainer,
    ToggleExpandIcon,
  }
}

export {
  useExpandableText,
}
