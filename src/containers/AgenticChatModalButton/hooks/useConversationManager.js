
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCreateConversationMutation } from '@/apiRTK/agenticAiApi'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { documentSelector } from '@/selectors/documentReviewPage'
import { notifyWarning } from '@/utils/notification'
import { truncateToWordBoundary } from '../utils/truncateToWordBoundary'
import { useChatSettings } from './'

export const useConversationManager = ({
  conversations,
  activeAgentVendorId,
  modes,
  fetchConversations,
}) => {
  const {
    activeConversationId,
    setActiveConversationId,
    setIsNewConversationMode,
    isNewConversationMode,
    createContextForAllTools,
  } = useChatSettings()

  const [initialTitle, setInitialTitle] = useState('')

  const document = useSelector(documentSelector)

  const [createConversationMutation, { isLoading }] = useCreateConversationMutation()

  useEffect(() => {
    if (activeConversationId || isNewConversationMode) return

    const conversationsForDocument = conversations[document._id]
    conversationsForDocument?.length && setActiveConversationId(conversationsForDocument[0].id)
  }, [
    activeConversationId,
    conversations,
    isNewConversationMode,
    document._id,
    setActiveConversationId,
  ])

  const startNewConversation = useCallback(() => {
    setActiveConversationId(null)
    setIsNewConversationMode(true)
    setInitialTitle('')
  }, [
    setActiveConversationId,
    setIsNewConversationMode,
  ])

  const createConversation = useCallback(async (firstPrompt = '') => {
    if (!activeAgentVendorId || !modes?.length) {
      notifyWarning(localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE))
      return null
    }

    try {
      const response = await createConversationMutation({
        agentVendorId: activeAgentVendorId,
        modeId: modes[0].id,
        title: initialTitle.trim() || truncateToWordBoundary(firstPrompt),
        arguments: createContextForAllTools(),
        relation: { documentId: document._id },
      }).unwrap()

      setActiveConversationId(response.id)
      setIsNewConversationMode(false)
      fetchConversations()

      return response.id
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
      return null
    }
  }, [
    activeAgentVendorId,
    createContextForAllTools,
    createConversationMutation,
    document._id,
    fetchConversations,
    initialTitle,
    modes,
    setActiveConversationId,
    setIsNewConversationMode,
  ])

  return {
    initialTitle,
    isCreating: isLoading,
    startNewConversation,
    createConversation,
    setInitialTitle,
  }
}
