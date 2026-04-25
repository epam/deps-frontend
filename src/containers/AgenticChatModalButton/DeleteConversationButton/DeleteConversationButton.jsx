
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { useDeleteConversationMutation } from '@/apiRTK/agenticAiApi'
import { Modal } from '@/components/Modal'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { useChatSettings } from '../hooks'

const DeleteConversationButton = ({
  conversationId,
  conversationTitle,
  nextConversationId,
  onAfterDelete,
  renderTrigger,
}) => {
  const [deleteConversation, { isLoading }] = useDeleteConversationMutation()
  const {
    activeConversationId,
    setActiveConversationId,
    setIsNewConversationMode,
  } = useChatSettings()

  const isActive = conversationId === activeConversationId

  const handleConversationSwitch = useCallback(() => {
    if (!isActive) {
      return
    }

    if (!nextConversationId || nextConversationId === conversationId) {
      setActiveConversationId(null)
      setIsNewConversationMode(true)
      return
    }

    setActiveConversationId(nextConversationId)
  }, [
    conversationId,
    isActive,
    nextConversationId,
    setActiveConversationId,
    setIsNewConversationMode,
  ])

  const handleDeleteConversation = useCallback(async () => {
    try {
      handleConversationSwitch()
      await deleteConversation(conversationId).unwrap()
      notifySuccess(localize(Localization.DELETE_COMPLETED))
      await onAfterDelete()
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DELETE_FAILED)
      notifyWarning(message)
    }
  }, [
    conversationId,
    deleteConversation,
    handleConversationSwitch,
    onAfterDelete,
  ])

  const confirmDeleteConversation = useCallback((event) => {
    event.stopPropagation()

    Modal.confirm({
      title: localize(Localization.CONFIRM_DELETING_CONVERSATION_MESSAGE, { title: conversationTitle }),
      okText: localize(Localization.DELETE),
      cancelText: localize(Localization.CANCEL),
      onOk: handleDeleteConversation,
    })
  }, [conversationTitle, handleDeleteConversation])

  return renderTrigger({
    onClick: confirmDeleteConversation,
    disabled: isLoading,
  })
}

DeleteConversationButton.propTypes = {
  conversationId: PropTypes.string.isRequired,
  conversationTitle: PropTypes.string.isRequired,
  nextConversationId: PropTypes.string,
  renderTrigger: PropTypes.func.isRequired,
}

export {
  DeleteConversationButton,
}
