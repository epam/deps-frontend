
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeChatDialogs, storeChatDialogs } from '@/actions/genAiChat'
import { getAiConversationData } from '@/api/aiConversationApi'
import { ButtonType } from '@/components/Button'
import { DraggableModal } from '@/components/DraggableModal'
import { MessageIcon } from '@/components/Icons/MessageIcon'
import { SettingsIcon } from '@/components/Icons/SettingsIcon'
import { GenAiChat } from '@/containers/GenAiChat'
import { AiContext, AiContextSelect } from '@/containers/GenAIModalButton/AiContextSelect'
import { PageSettingsModal } from '@/containers/PageSettingsModal'
import { SelectLLMSettingsButton } from '@/containers/SelectLLMSettingsButton'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { Localization, localize } from '@/localization/i18n'
import { GenAiChatDialog, GenAiChatMessage } from '@/models/GenAiChatDialog'
import { LLMProvider } from '@/models/LLMProvider'
import { UnifiedData } from '@/models/UnifiedData'
import { documentSelector, idSelector } from '@/selectors/documentReviewPage'
import { documentChatDialogsSelector } from '@/selectors/genAiChat'
import { notifyWarning } from '@/utils/notification'
import {
  CloseIcon,
  ModalHeaderCell,
  ModalHeaderContainer,
  ModalTitle,
  OpenModalButton,
  PageSettingsButton,
  Separator,
} from './GenAIModalButton.styles'

const RECENT_LLMS_QUANTITY = 5

const CHAT_BUTTON_TOOLTIP = {
  title: localize(Localization.OPEN_CHAT),
}

const findProviderAndModelInfo = (providerCode, modelCode, providersList) => {
  const foundProvider = providersList?.find((provider) => provider.code === providerCode)
  const foundModel = foundProvider?.models.find((model) => model.code === modelCode)

  return {
    foundProvider,
    foundModel,
  }
}

const doesModelExist = (providerCode, modelCode, providersList) => {
  const { foundProvider, foundModel } = findProviderAndModelInfo(providerCode, modelCode, providersList)

  return !!(foundProvider && foundModel)
}

const getProviderModelFromCompletions = (completions, providers) => {
  const { provider, model } = completions.at(-1)
  const { foundProvider, foundModel } = findProviderAndModelInfo(provider, model, providers)

  if (!foundProvider || !foundModel) {
    return null
  }

  return {
    provider,
    model,
  }
}

const getActiveLLMSettings = ({ conversation, providers }) => {
  const defaultProvider = providers[0]
  const defaultModel = defaultProvider?.models?.[0]

  if (!defaultProvider || !defaultModel) {
    return null
  }

  const defaultProviderModel = {
    provider: defaultProvider.code,
    model: defaultModel.code,
  }

  if (conversation.completions.length) {
    return getProviderModelFromCompletions(conversation.completions, providers) || defaultProviderModel
  }

  return defaultProviderModel
}

const mapCompletionsToChatDialogs = (documentId, completions) => (
  completions.map(({
    createdAt,
    question,
    response,
    code,
    model,
    provider,
  }) => {
    const time = dayjs(createdAt).format('HH:mm')
    const prompt = new GenAiChatMessage(time, question)
    const answer = new GenAiChatMessage(time, response)

    return new GenAiChatDialog({
      id: code,
      documentId,
      prompt,
      answer,
      model,
      provider,
    })
  })
)

const getBlobFilesForPageRange = (unifiedData, pageSpan) => {
  const [startPage, endPage] = pageSpan.map(Number)

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
    return UnifiedData.getBlobNameByPage(unifiedData, startPage + i)
  })
}

const GenAIModalButton = ({
  isModalVisible,
  toggleModal,
}) => {
  const [activeLLMSettings, setActiveLLMSettings] = useState(null)
  const [conversationData, setConversationData] = useState(null)
  const [pageSpan, setPageSpan] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const [aiContext, setAiContext] = useState(AiContext.TEXT_ONLY)

  const documentId = useSelector(idSelector)
  const dialogs = useSelector(documentChatDialogsSelector)
  const document = useSelector(documentSelector)
  const dispatch = useDispatch()

  const storeDialogs = useCallback((completions) => {
    const dialogs = mapCompletionsToChatDialogs(documentId, completions)

    if (dialogs.length) {
      dispatch(storeChatDialogs(dialogs))
    }
  }, [dispatch, documentId])

  const fetchConversationData = useCallback(async () => {
    try {
      setIsFetching(true)
      const conversationData = await getAiConversationData(documentId)
      const filteredData = {
        ...conversationData,
        providers: LLMProvider.getAvailable(conversationData.providers),
      }

      setConversationData(filteredData)
      setActiveLLMSettings(getActiveLLMSettings(filteredData))
      storeDialogs(conversationData.conversation.completions)
    } catch {
      notifyWarning(localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE))
    } finally {
      setIsFetching(false)
    }
  }, [documentId, storeDialogs])

  useEffect(() => {
    isModalVisible && fetchConversationData()

    return () => {
      dispatch(removeChatDialogs(documentId))
      setActiveLLMSettings(null)
    }
  }, [
    documentId,
    dispatch,
    fetchConversationData,
    isModalVisible,
  ])

  const recentLLMsSettings = useMemo(() => {
    const settings = dialogs
      .map(({ model, provider }) => ({
        model,
        provider,
      }))
      .filter(({ model, provider }) => (
        doesModelExist(provider, model, conversationData?.providers)),
      )
      .reverse()

    return Array.from(
      new Set(settings.map((d) => JSON.stringify(d))))
      .map((d) => JSON.parse(d))
      .slice(-RECENT_LLMS_QUANTITY)
  }, [
    dialogs,
    conversationData?.providers,
  ])

  const isMultimodalModel = useMemo(() => {
    if (!activeLLMSettings || !conversationData?.providers) {
      return false
    }

    const { foundModel } = findProviderAndModelInfo(
      activeLLMSettings.provider,
      activeLLMSettings.model,
      conversationData.providers,
    )

    return foundModel?.contextType === LLMModelContextType.MULTIMODAL
  }, [
    activeLLMSettings,
    conversationData?.providers,
  ])

  const handleLLMSettingsChange = useCallback((settings) => {
    setActiveLLMSettings(settings)
    setAiContext(AiContext.TEXT_ONLY)
  }, [])

  const documentFiles = useMemo(() => {
    if (aiContext === AiContext.TEXT_AND_IMAGES && document?.unifiedData) {
      const blobFiles = pageSpan.length
        ? getBlobFilesForPageRange(document.unifiedData, pageSpan)
        : UnifiedData.getBlobNames(document.unifiedData)

      return blobFiles.filter(Boolean)
    }

    return null
  }, [
    aiContext,
    document?.unifiedData,
    pageSpan,
  ])

  const renderPageSettingsTrigger = useCallback((onClick) => (
    <PageSettingsButton
      disabled={!activeLLMSettings}
      onClick={onClick}
      type={ButtonType.PRIMARY}
    >
      <SettingsIcon />
      {localize(Localization.PAGE_SETTINGS)}
    </PageSettingsButton>
  ), [activeLLMSettings])

  const renderHeaderContent = useCallback(() => (
    <ModalHeaderContainer>
      <ModalHeaderCell>
        <ModalTitle>
          {localize(Localization.CHAT)}
        </ModalTitle>
        <Separator />
        <SelectLLMSettingsButton
          activeLLMSettings={activeLLMSettings}
          isLoading={isFetching}
          providers={conversationData?.providers}
          recentLLMsSettings={recentLLMsSettings}
          setActiveLLMSettings={handleLLMSettingsChange}
        />
        {
          isMultimodalModel && (
            <AiContextSelect
              onChange={setAiContext}
              value={aiContext}
            />
          )
        }
      </ModalHeaderCell>
      <ModalHeaderCell>
        <PageSettingsModal
          activePageRange={pageSpan}
          onPageRangeChange={setPageSpan}
          renderTrigger={renderPageSettingsTrigger}
        />
        <Separator />
        <CloseIcon
          aria-label={localize(Localization.CLOSE)}
          onClick={toggleModal}
        />
      </ModalHeaderCell>
    </ModalHeaderContainer>
  ), [
    conversationData,
    isFetching,
    toggleModal,
    activeLLMSettings,
    pageSpan,
    recentLLMsSettings,
    renderPageSettingsTrigger,
    aiContext,
    isMultimodalModel,
    handleLLMSettingsChange,
  ])

  const renderTrigger = ({ disabled, onClick }) => (
    <OpenModalButton
      aria-label={localize(Localization.OPEN_CHAT)}
      disabled={disabled}
      icon={<MessageIcon />}
      onClick={onClick}
      tooltip={CHAT_BUTTON_TOOLTIP}
    />
  )

  return (
    <DraggableModal
      isModalVisible={isModalVisible}
      renderHeaderContent={renderHeaderContent}
      renderTrigger={renderTrigger}
      toggleModal={toggleModal}
    >
      <GenAiChat
        activeLLMSettings={activeLLMSettings}
        files={documentFiles}
        isFetching={isFetching}
        pageSpan={pageSpan}
      />
    </DraggableModal>
  )
}

GenAIModalButton.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export {
  GenAIModalButton,
}
