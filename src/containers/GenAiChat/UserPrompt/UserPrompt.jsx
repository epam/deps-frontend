
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Localization, localize } from '@/localization/i18n'
import { genAiChatMessageShape } from '@/models/GenAiChatDialog'
import { documentSelector } from '@/selectors/documentReviewPage'
import { DeletePromptButton } from '../DeletePromptButton'
import {
  MessageWrapper,
  MessageHeader,
  MessageTime,
  MessageOwner,
  Message,
} from './UserPrompt.styles'

const UserPrompt = ({ prompt, messageId }) => {
  const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState(false)

  const document = useSelector(documentSelector)

  const toggleDeleteButton = useCallback(() => {
    setIsDeleteButtonVisible((prev) => !prev)
  }, [])

  return (
    <MessageWrapper
      onMouseEnter={toggleDeleteButton}
      onMouseLeave={toggleDeleteButton}
    >
      <MessageHeader>
        <MessageTime>{prompt.time}</MessageTime>
        <MessageOwner>{localize(Localization.YOU)}</MessageOwner>
      </MessageHeader>
      <Message>{prompt.message}</Message>
      {
        isDeleteButtonVisible && (
          <DeletePromptButton
            documentId={document._id}
            messageId={messageId}
          />
        )
      }
    </MessageWrapper>
  )
}

UserPrompt.propTypes = {
  prompt: genAiChatMessageShape.isRequired,
  messageId: PropTypes.string.isRequired,
}

export { UserPrompt }
