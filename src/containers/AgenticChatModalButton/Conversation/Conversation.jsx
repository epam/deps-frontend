
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import {
  useCallback,
  useEffect,
  useMemo,
  Fragment,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeChatDialogs, storeChatDialogs } from '@/actions/agenticChat'
import { useFetchConversationQuery } from '@/apiRTK/agenticAiApi'
import { Spin } from '@/components/Spin'
import { AiAnswer } from '@/containers/AiAnswer'
import { UserPrompt } from '@/containers/UserPrompt'
import { Localization, localize } from '@/localization/i18n'
import { AgenticChatDialogMessage, AgenticChatDialog } from '@/models/AgenticChat'
import { selectAgenticChatByConversationId } from '@/selectors/agenticChat'
import { documentSelector } from '@/selectors/documentReviewPage'
import { notifyWarning } from '@/utils/notification'
import { ChatInput } from '../ChatInput'
import { useUpdateQuestion } from '../hooks'
import { ThinkingMessage } from '../ThinkingMessage'
import {
  EmptyChatImage,
  Wrapper,
} from './Conversation.styles'

const mapCompletionsToChatDialogs = (conversationId, completions) => (
  completions.map(({
    id,
    answer,
    question,
  }) => new AgenticChatDialog({
    id,
    conversationId,
    question: new AgenticChatDialogMessage(dayjs(question.createdAt).format('HH:mm'), question.text),
    answer: answer && new AgenticChatDialogMessage(dayjs(answer.createdAt).format('HH:mm'), answer.text),
  }),
  ))

const Conversation = ({
  containerRef,
  conversationId,
  editMessage,
  isCompletionProcessing,
}) => {
  const dialogs = useSelector(selectAgenticChatByConversationId(conversationId))
  const dispatch = useDispatch()
  const document = useSelector(documentSelector)

  const {
    data: conversation,
    isFetching,
    isError,
  } = useFetchConversationQuery({ conversationId }, {
    refetchOnMountOrArgChange: true,
  })

  const {
    editedCompletionId,
    setEditingMode,
    resetEditingMode,
    saveEditedQuestion,
    updatedQuestion,
    setUpdatedQuestion,
  } = useUpdateQuestion({
    conversationId,
    editMessage,
  })

  const isConversationFromDifferentDocument = useMemo(() =>
    !!conversation && conversation.relation?.details?.documentId !== document._id,
  [conversation, document._id],
  )

  const storeDialogs = useCallback((completions) => {
    const sortedCompletions = [...completions].sort((a, b) =>
      new Date(a.question.createdAt) - new Date(b.question.createdAt),
    )

    const dialogs = mapCompletionsToChatDialogs(conversationId, sortedCompletions)

    if (dialogs.length) {
      dispatch(storeChatDialogs(dialogs))
    }
  }, [dispatch, conversationId])

  useEffect(() => {
    if (isError) {
      notifyWarning(localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE))
    }
    conversation && storeDialogs(conversation.completions)
  }, [
    conversation,
    isError,
    storeDialogs,
  ])

  useEffect(() => {
    return () => {
      resetEditingMode()
      dispatch(removeChatDialogs(conversationId))
    }
  }, [
    conversationId,
    dispatch,
    resetEditingMode,
  ])

  const areActionsDisabled = isFetching || isCompletionProcessing || isConversationFromDifferentDocument

  const renderQuestion = useCallback((id, question, answer) => {
    if (!question) {
      return null
    }

    if (id === editedCompletionId) {
      return (
        <ChatInput
          disabled={false}
          onCancel={resetEditingMode}
          prompt={updatedQuestion}
          saveDialog={() => saveEditedQuestion(id)}
          setPrompt={setUpdatedQuestion}
        />
      )
    }

    return (
      <UserPrompt
        areActionsDisabled={areActionsDisabled}
        message={question.text}
        onEdit={() => setEditingMode(id, question.text)}
        {...(!answer && {
          onRetry: () => editMessage(id, question.text),
        })}
        time={question.createdAt}
      />
    )
  }, [
    editedCompletionId,
    editMessage,
    areActionsDisabled,
    resetEditingMode,
    saveEditedQuestion,
    setEditingMode,
    setUpdatedQuestion,
    updatedQuestion,
  ])

  const Content = useMemo(() => {
    if (isFetching && !isCompletionProcessing) {
      return <Spin.Centered spinning />
    }

    if (!dialogs.length && !isCompletionProcessing) {
      return <EmptyChatImage />
    }

    return (
      <>
        {
          dialogs.map(({ id, question, answer }, index) => (
            <Fragment key={index}>
              {renderQuestion(id, question, answer)}
              {
                answer && (
                  <AiAnswer
                    allowSave={!isConversationFromDifferentDocument}
                    answer={answer.text}
                    prompt={question.text}
                    time={answer.createdAt}
                  />
                )
              }
            </Fragment>
          ))
        }
        {isCompletionProcessing && <ThinkingMessage />}
      </>
    )
  }, [
    dialogs,
    isConversationFromDifferentDocument,
    isFetching,
    isCompletionProcessing,
    renderQuestion,
  ])

  return (
    <Wrapper ref={containerRef}>
      {Content}
    </Wrapper>
  )
}

Conversation.propTypes = {
  containerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  conversationId: PropTypes.string.isRequired,
  editMessage: PropTypes.func.isRequired,
  isCompletionProcessing: PropTypes.bool.isRequired,
}

export {
  Conversation,
}
