
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { Localization, localize } from '@/localization/i18n'
import { Actions } from './Actions'
import {
  MessageWrapper,
  MessageHeader,
  MessageTime,
  MessageOwner,
  Message,
  MessageText,
} from './UserPrompt.styles'

const UserPrompt = ({
  areActionsDisabled,
  message,
  time,
  onEdit,
  onRetry,
}) => {
  const [areActionsVisible, setAreActionsVisible] = useState(false)

  const showActions = useCallback(() => {
    setAreActionsVisible(true)
  }, [])

  const hideActions = useCallback(() => {
    setAreActionsVisible(false)
  }, [])

  return (
    <MessageWrapper
      onMouseEnter={showActions}
      onMouseLeave={hideActions}
    >
      <MessageHeader>
        <MessageTime>{time}</MessageTime>
        <MessageOwner>{localize(Localization.YOU)}</MessageOwner>
      </MessageHeader>
      <Message>
        <MessageText>{message}</MessageText>
      </Message>
      {
        areActionsVisible && (
          <Actions
            disabled={areActionsDisabled}
            onEditButtonClick={onEdit}
            onRetryButtonClick={onRetry}
          />
        )
      }
    </MessageWrapper>
  )
}

UserPrompt.propTypes = {
  message: PropTypes.string,
  time: PropTypes.string.isRequired,
  areActionsDisabled: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRetry: PropTypes.func,
}

export { UserPrompt }
