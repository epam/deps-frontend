
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Localization, localize } from '@/localization/i18n'
import { MAX_CONVERSATION_TITLE_LENGTH } from '../constants'
import { TitleInput } from './InitialConversationTitleInput.styles'

const DEBOUNCE_TIME = 300

const InitialConversationTitleInput = ({
  setTitle,
  initialTitle,
  className,
}) => {
  const [value, setValue] = useState(initialTitle)

  useEffect(() => {
    setValue(initialTitle)
  }, [initialTitle])

  const debouncedSetTitle = useMemo(
    () => debounce((value) => {
      setTitle(value)
    }, DEBOUNCE_TIME),
    [setTitle],
  )

  const onTitleChange = useCallback((e) => {
    const newTitle = e?.target?.value
    setValue(newTitle)
    debouncedSetTitle(newTitle)
  }, [debouncedSetTitle])

  return (
    <TitleInput
      className={className}
      maxLength={MAX_CONVERSATION_TITLE_LENGTH}
      onChange={onTitleChange}
      placeholder={localize(Localization.AGENTIC_CHAT_CONVERSATION_TITLE_PLACEHOLDER)}
      value={value}
    />
  )
}

InitialConversationTitleInput.propTypes = {
  setTitle: PropTypes.func.isRequired,
  initialTitle: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export {
  InitialConversationTitleInput,
}
