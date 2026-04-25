
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { removeChatMessages } from '@/actions/genAiChat'
import { deleteAiConversationMessages } from '@/api/aiConversationApi'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { Modal } from '@/components/Modal'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { MessageActionButton } from './DeletePromptButton.styles'

const DeletePromptButton = ({ messageId, documentId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const handleRemove = useCallback(async () => {
    try {
      setIsLoading(true)
      await deleteAiConversationMessages(
        documentId,
        messageId,
      )
      dispatch(removeChatMessages({
        documentId,
        messageId,
      }))
      notifySuccess(localize(Localization.MESSAGE_DELETE_SUCCESS))
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR_MESSAGE))
    } finally {
      setIsLoading(false)
    }
  }, [
    dispatch,
    documentId,
    messageId,
  ])

  const confirmRemoval = (e) => {
    e.stopPropagation()
    Modal.confirm({
      title: localize(Localization.DELETE_PROMPT_CONFIRM_MESSAGE),
      onOk: handleRemove,
      okText: localize(Localization.DELETE),
    })
  }

  return (
    <MessageActionButton
      disabled={isLoading}
      icon={<TrashIcon />}
      onClick={confirmRemoval}
    />
  )
}

DeletePromptButton.propTypes = {
  messageId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
}

export {
  DeletePromptButton,
}
