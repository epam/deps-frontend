import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef } from 'react'
import { InputNumber } from '@/components/InputNumber'
import { MOUSE_BUTTON_DETAIL } from '@/constants/common'
import { ONLY_INTEGERS } from '@/constants/regexp'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { Wrapper } from './GoToPageInput.styles'

const GoToPageInput = ({ goToPage, validate }) => {
  const focusRef = useRef(null)

  const isValid = useCallback((value) => (
    validate
      ? validate(value)
      : ONLY_INTEGERS.test(value)
  ), [validate])

  const goTo = useCallback((e) => {
    if (e.relatedTarget) {
      return
    }
    const { value } = e.target

    if (!value) {
      return
    }

    if (!isValid(value)) {
      return notifyWarning(localize(Localization.INVALID_PAGE_NUMBER))
    }

    goToPage(e)
  }, [goToPage, isValid])

  const onUnFocus = useCallback((event) => {
    if (event.target === focusRef.current) {
      return
    }

    window.removeEventListener('pointerdown', onUnFocus)

    if (event.which !== MOUSE_BUTTON_DETAIL.LEFT) {
      return
    }

    focusRef.current.addEventListener('blur', goTo, {
      once: true,
    })

    event.target.focus()
  }, [goTo])

  const onFocus = (event) => {
    focusRef.current = event.target

    window.addEventListener('pointerdown', onUnFocus)
  }

  useEffect(() => () => {
    window.removeEventListener('pointerdown', onUnFocus)
  }, [onUnFocus])

  return (
    <Wrapper>
      <span>{localize(Localization.GO_TO_PAGE)}</span>
      <InputNumber
        controls={false}
        onFocus={onFocus}
        onPressEnter={goTo}
      />
    </Wrapper>
  )
}

GoToPageInput.propTypes = {
  goToPage: PropTypes.func.isRequired,
  validate: PropTypes.func,
}

export { GoToPageInput }
