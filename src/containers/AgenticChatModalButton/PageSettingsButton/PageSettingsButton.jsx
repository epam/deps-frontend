
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { PageSettingsModal } from '@/containers/PageSettingsModal'
import { localize, Localization } from '@/localization/i18n'
import { useChatSettings } from '../hooks'
import { SettingsButton } from '../SettingsButton'

const getModalStyle = (container) => {
  if (!container) {
    return {}
  }

  const { height, right } = container.getBoundingClientRect()
  const parentRect = container.offsetParent?.getBoundingClientRect()

  return {
    bottom: height,
    right: parentRect ? Math.max(0, parentRect.right - right) : 0,
  }
}

const PageSettingsButton = ({ disabled }) => {
  const [isButtonActive, setIsButtonActive] = useState(false)
  const { pageSpan, setPageSpan } = useChatSettings()
  const ref = useRef(null)

  const toggleButtonView = () => setIsButtonActive((open) => !open)

  const buttonTitle = useMemo(() => {
    if (pageSpan.length === 0) {
      return localize(Localization.ALL_PAGES)
    }

    const [start, end] = pageSpan

    return localize(Localization.PAGES_RANGE, { range: `${start} - ${end}` })
  }, [pageSpan])

  const renderPageSettingsTrigger = useCallback((onClick) => (
    <SettingsButton
      ref={ref}
      disabled={disabled}
      isActive={isButtonActive}
      onClick={onClick}
      title={buttonTitle}
    />
  ), [
    buttonTitle,
    disabled,
    isButtonActive,
  ])

  return (
    <PageSettingsModal
      activePageRange={pageSpan}
      modalStyle={getModalStyle(ref.current)}
      onAfterToggle={toggleButtonView}
      onPageRangeChange={setPageSpan}
      renderTrigger={renderPageSettingsTrigger}
    />
  )
}

PageSettingsButton.propTypes = {
  disabled: PropTypes.bool,
}

export {
  PageSettingsButton,
}
