
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import {
  useMemo,
  useState,
  useRef,
  Fragment,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import {
  storeChatDialog,
  updateDialogAnswer,
} from '@/actions/genAiChat'
import { createAiCompletion } from '@/api/aiConversationApi'
import { Localization, localize } from '@/localization/i18n'
import { GenAiChatDialog, GenAiChatMessage } from '@/models/GenAiChatDialog'
import { llmSettingsShape } from '@/models/LLMProvider'
import { documentSelector } from '@/selectors/documentReviewPage'
import { documentChatDialogsSelector } from '@/selectors/genAiChat'
import { notifyWarning } from '@/utils/notification'
import { AiAnswer } from './AiAnswer'
import { ChatCommandBar } from './ChatCommandBar'
import { ChatInput } from './ChatInput'
import {
  Wrapper,
  Notification,
  Conversation,
  ChatFooter,
  EmptyChatImage,
  Spin,
} from './GenAiChat.styles'
import { UserPrompt } from './UserPrompt'

const createChatDialog = ({
  userPrompt,
  documentId,
  llmSettings,
}) => {
  const time = dayjs().format('HH:mm')
  const prompt = new GenAiChatMessage(time, userPrompt)
  const answer = new GenAiChatMessage(time)
  const { model, provider } = llmSettings

  return new GenAiChatDialog({
    id: uuidv4(),
    documentId,
    prompt,
    answer,
    model,
    provider,
  })
}

const scrollToElement = (el) => {
  setTimeout(() => {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    })
  })
}

const GenAiChat = ({
  activeLLMSettings,
  pageSpan,
  isFetching,
  files,
}) => {
  const [prompt, setPrompt] = useState('')
  const [isAiCompletionCreating, setIsAiCompletionCreating] = useState(false)

  const dialogs = useSelector(documentChatDialogsSelector)
  const document = useSelector(documentSelector)

  const ref = useRef(null)

  const dispatch = useDispatch()

  const updateAnswer = (dialogId, response) => {
    const { response: aiAnswer, createdAt } = response
    const answer = new GenAiChatMessage(dayjs(createdAt).format('HH:mm'), aiAnswer)

    dispatch(updateDialogAnswer({
      documentId: document._id,
      dialogId,
      answer,
    }))
  }

  const getAiAnswer = async (dialogId) => {
    try {
      setIsAiCompletionCreating(true)
      const data = {
        ...activeLLMSettings,
        question: prompt,
      }

      if (pageSpan.length === 2) {
        data.pageSpan = pageSpan
      }

      if (files) {
        data.files = files
      }

      const response = await createAiCompletion(document._id, data)
      setPrompt('')
      updateAnswer(dialogId, response)
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
      dispatch(updateDialogAnswer({
        documentId: document._id,
        dialogId,
        answer: null,
      }))
    } finally {
      setIsAiCompletionCreating(false)
    }
  }

  const saveDialog = async () => {
    if (!prompt) {
      return
    }

    const dialog = createChatDialog({
      userPrompt: prompt,
      documentId: document._id,
      llmSettings: activeLLMSettings,
    })

    dispatch(storeChatDialog(dialog))
    getAiAnswer(dialog.id)
    scrollToElement(ref.current)
  }

  const ChatConversation = useMemo(() => {
    if (!dialogs.length) {
      return <EmptyChatImage />
    }

    return dialogs.map(({ id, prompt, answer }, index) => (
      <Fragment key={index}>
        <UserPrompt
          messageId={id}
          prompt={prompt}
        />
        <AiAnswer
          answer={answer}
          prompt={prompt}
        />
      </Fragment>
    ))
  }, [dialogs])

  const isSendPromptDisabled = (
    isAiCompletionCreating ||
    !prompt ||
    !activeLLMSettings
  )

  return (
    <Spin spinning={isFetching}>
      <Wrapper>
        <Notification>
          {localize(Localization.GEN_AI_CHAT_NOTIFICATION)}
        </Notification>
        <Conversation ref={ref}>
          {ChatConversation}
        </Conversation>
        <ChatFooter>
          <ChatInput
            disabled={isAiCompletionCreating || !activeLLMSettings}
            prompt={prompt}
            saveDialog={saveDialog}
            setPrompt={setPrompt}
          />
          <ChatCommandBar
            dialogs={dialogs}
            document={document}
            isSendPromptDisabled={isSendPromptDisabled}
            saveDialog={saveDialog}
          />
        </ChatFooter>
      </Wrapper>
    </Spin>
  )
}

GenAiChat.propTypes = {
  activeLLMSettings: llmSettingsShape,
  pageSpan: PropTypes.arrayOf(PropTypes.string).isRequired,
  isFetching: PropTypes.bool.isRequired,
  files: PropTypes.arrayOf(PropTypes.string),
}

export {
  GenAiChat,
}
