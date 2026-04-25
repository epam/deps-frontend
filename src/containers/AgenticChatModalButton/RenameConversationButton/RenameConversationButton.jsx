
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { useUpdateConversationMutation } from '@/apiRTK/agenticAiApi'
import { TextEditorModal } from '@/components/TextEditorModal'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { MAX_CONVERSATION_TITLE_LENGTH } from '../constants'

const MODAL_STYLE = {
  left: '2%',
}

const RenameConversationButton = ({
  conversationId,
  conversationTitle,
  onAfterClose,
  onAfterRename,
  renderTrigger,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [
    updateConversation,
    { isLoading },
  ] = useUpdateConversationMutation()

  const closeModal = useCallback(() => {
    setIsModalVisible(false)
    onAfterClose()
  }, [onAfterClose])

  const openModal = () => {
    setIsModalVisible(true)
  }

  const handleUpdate = useCallback(async (updatedTitle) => {
    try {
      if (updatedTitle === conversationTitle) {
        closeModal()
        return
      }

      await updateConversation({
        conversationId,
        data: {
          title: updatedTitle,
        },
      }).unwrap()
      notifySuccess(localize(Localization.CONVERSATION_UPDATED))
      closeModal()
      onAfterRename(updatedTitle)
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }, [
    closeModal,
    conversationId,
    conversationTitle,
    onAfterRename,
    updateConversation,
  ])

  return (
    <div>
      {renderTrigger({ onClick: openModal })}
      {
        isModalVisible && (
          <TextEditorModal
            isLoading={isLoading}
            maxLength={MAX_CONVERSATION_TITLE_LENGTH}
            onCancel={closeModal}
            onSubmit={handleUpdate}
            placeholder={localize(Localization.ENTER_CONVERSATION_NAME)}
            style={MODAL_STYLE}
            value={conversationTitle}
          />
        )
      }
    </div>
  )
}

RenameConversationButton.propTypes = {
  conversationId: PropTypes.string.isRequired,
  conversationTitle: PropTypes.string.isRequired,
  onAfterClose: PropTypes.func.isRequired,
  onAfterRename: PropTypes.func.isRequired,
  renderTrigger: PropTypes.func.isRequired,
}

export {
  RenameConversationButton,
}
