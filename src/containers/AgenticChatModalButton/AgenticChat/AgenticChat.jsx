
import dayjs from 'dayjs'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { storeChatDialog } from '@/actions/agenticChat'
import { useLazyFetchConversationQuery } from '@/apiRTK/agenticAiApi'
import { AgenticChatDialog, AgenticChatDialogMessage } from '@/models/AgenticChat'
import { documentSelector } from '@/selectors/documentReviewPage'
import { ChatContent } from '../ChatContent'
import { ChatFooter } from '../ChatFooter'
import { ChatHeaderBase } from '../ChatHeaderBase'
import { ChatHeaderExpanded } from '../ChatHeaderExpanded'
import { ConversationsSidebar } from '../ConversationsSidebar'
import {
  useAgenticChatData,
  useAgenticChatStream,
  useConversationManager,
  useChatSettings,
} from '../hooks'
import {
  ConversationWrapper,
  Wrapper,
  Spin,
} from './AgenticChat.styles'

const createChatDialog = ({
  userPrompt,
  conversationId,
  answerText,
}) => {
  const time = dayjs().format('HH:mm')

  return new AgenticChatDialog({
    id: uuidv4(),
    conversationId,
    ...(userPrompt && { question: new AgenticChatDialogMessage(time, userPrompt) }),
    ...(answerText && { answer: new AgenticChatDialogMessage(time, answerText) }),
  })
}

const scrollToElement = (el) => {
  if (!el) {
    return
  }

  requestAnimationFrame(() => {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    })
  })
}

const AgenticChat = () => {
  const [prompt, setPrompt] = useState('')

  const dispatch = useDispatch()
  const containerRef = useRef(null)
  const document = useSelector(documentSelector)

  const {
    conversations,
    documentsIds,
    activeAgentVendorId,
    modes,
    isFetching: isDataFetching,
    isError,
    hasMore,
    fetchConversations,
  } = useAgenticChatData()

  const {
    activeConversationId,
    activeDocumentData,
    createContextForSelectedTools,
    isExpandedView,
  } = useChatSettings()

  const {
    createCompletion,
    editCompletion,
    isCompletionProcessing,
  } = useAgenticChatStream()

  const {
    initialTitle,
    isCreating,
    startNewConversation,
    createConversation,
    setInitialTitle,
  } = useConversationManager({
    conversations,
    activeAgentVendorId,
    modes,
    fetchConversations,
  })

  const currentDocumentConversations = useMemo(
    () => conversations[document._id] ?? [],
    [conversations, document._id],
  )

  const isFetching = isDataFetching || isCreating

  const isConversationFromDifferentDocument = useMemo(() =>
    !!activeDocumentData && activeDocumentData.documentId !== document._id,
  [activeDocumentData, document._id],
  )

  const saveDialog = useCallback(({ conversationId, userPrompt, answerText }) => {
    const dialog = createChatDialog({
      conversationId,
      userPrompt,
      answerText,
    })
    dispatch(storeChatDialog(dialog))
    scrollToElement(containerRef.current)
  }, [dispatch])

  const [fetchConversation] = useLazyFetchConversationQuery()

  const sendMessage = useCallback(async (prompt) => {
    if (!prompt) return

    const conversationId = activeConversationId || await createConversation(prompt)
    if (!conversationId) return

    saveDialog({
      conversationId,
      userPrompt: prompt,
    })

    await createCompletion({
      conversationId,
      userQuestion: prompt,
      chatArguments: createContextForSelectedTools(),
      onCompletionCreation: () => {
        setPrompt('')
      },
      onFinal: () => fetchConversation({ conversationId }),
    })
  }, [
    activeConversationId,
    createConversation,
    createContextForSelectedTools,
    fetchConversation,
    saveDialog,
    createCompletion,
  ])

  const editMessage = useCallback(async (completionId, userQuestion) => {
    await editCompletion({
      conversationId: activeConversationId,
      completionId,
      userQuestion,
      chatArguments: createContextForSelectedTools(),
      onFinal: () => fetchConversation({ conversationId: activeConversationId }),
    })
  }, [
    activeConversationId,
    createContextForSelectedTools,
    editCompletion,
    fetchConversation,
  ])

  const handleSuggestedPromptClick = useCallback((suggestedPrompt) => {
    setPrompt(suggestedPrompt)
    sendMessage(suggestedPrompt)
  }, [sendMessage])

  return (
    <Spin spinning={isFetching}>
      <Wrapper $isExpanded={isExpandedView}>
        {
          isExpandedView && (
            <ConversationsSidebar
              conversations={conversations}
              documentsIds={documentsIds}
              fetchConversations={fetchConversations}
              hasMore={hasMore}
              isFetching={isFetching}
              onStartNewConversation={startNewConversation}
            />
          )
        }
        <ConversationWrapper $isExpanded={isExpandedView}>
          {
            isExpandedView ? (
              <ChatHeaderExpanded
                activeConversationId={activeConversationId}
                initialTitle={initialTitle}
                isConversationFromDifferentDocument={isConversationFromDifferentDocument}
                onTitleChange={setInitialTitle}
              />
            ) : (
              <ChatHeaderBase
                activeConversationId={activeConversationId}
                currentDocumentConversations={currentDocumentConversations}
                disabled={isError}
                initialTitle={initialTitle}
                onCreateNew={startNewConversation}
                onTitleChange={setInitialTitle}
              />
            )
          }
          <ChatContent
            containerRef={containerRef}
            editMessage={editMessage}
            isCompletionProcessing={isCompletionProcessing}
            onSuggestedPromptClick={handleSuggestedPromptClick}
          />
          {
            !isConversationFromDifferentDocument && (
              <ChatFooter
                disabled={isFetching || isError || isCompletionProcessing}
                onSendMessage={() => sendMessage(prompt)}
                prompt={prompt}
                setPrompt={setPrompt}
              />
            )
          }
        </ConversationWrapper>
      </Wrapper>
    </Spin>
  )
}

export {
  AgenticChat,
}
