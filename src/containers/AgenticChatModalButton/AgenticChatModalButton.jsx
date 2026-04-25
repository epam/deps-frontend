
import { useMemo } from 'react'
import { Button } from '@/components/Button'
import { AGENTIC_CHAT_MODAL_STATE } from '@/constants/storage'
import { Localization, localize } from '@/localization/i18n'
import { AgenticChat } from './AgenticChat'
import { ExpandedModal, DraggableModal } from './AgenticChatModalButton.styles'
import { useChatSettings } from './hooks'
import { ModalHeader } from './ModalHeader'
import { ChatSettingsProvider } from './providers'

const EXPANDED_MODAL_CONFIG = {
  WIDTH: '98%',
  TOP_OFFSET: 0,
}

const AgenticChatModalButton = () => {
  const {
    isExpandedView,
    isModalVisible,
    openModal,
  } = useChatSettings()

  const ExpandedComponent = useMemo(() => (
    <ExpandedModal
      closable={false}
      destroyOnClose
      footer={null}
      maskClosable={false}
      open={isModalVisible}
      style={{ top: EXPANDED_MODAL_CONFIG.TOP_OFFSET }}
      title={<ModalHeader />}
      width={EXPANDED_MODAL_CONFIG.WIDTH}
    >
      <AgenticChat />
    </ExpandedModal>
  ), [
    isModalVisible,
  ])

  const DraggableComponent = useMemo(() => (
    <DraggableModal
      isModalVisible={isModalVisible}
      renderHeaderContent={() => <ModalHeader />}
      storageKey={AGENTIC_CHAT_MODAL_STATE}
    >
      <AgenticChat />
    </DraggableModal>
  ), [
    isModalVisible,
  ])

  return (
    <>
      <Button.Text
        disabled={isModalVisible}
        onClick={openModal}
      >
        {localize(Localization.DEPS_AGENT_CHAT)}
      </Button.Text>
      {isExpandedView ? ExpandedComponent : DraggableComponent}
    </>
  )
}

const AgenticChatModalButtonWithProvider = (props) => (
  <ChatSettingsProvider {...props}>
    <AgenticChatModalButton {...props} />
  </ChatSettingsProvider>
)

export {
  AgenticChatModalButtonWithProvider as AgenticChatModalButton,
}
