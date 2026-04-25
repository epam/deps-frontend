
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useState,
  createContext,
} from 'react'
import { useSelector } from 'react-redux'
import { AgentConversationsFilterKey } from '@/constants/navigation'
import { AgenticAiParameters } from '@/enums/AgenticAiParameters'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { documentSelector, documentTypeSelector } from '@/selectors/documentReviewPage'

const PER_PAGE = 20
const DEFAULT_PAGE = 1

const DEFAULT_FILTER = {
  [AgentConversationsFilterKey.SIZE]: PER_PAGE,
}

const createContextArguments = (tools, PARAMETERS_VALUE_BY_NAME) =>
  tools.reduce((acc, tool) => {
    const parameters = tool.parameters
      .filter((parameter) => Object.keys(PARAMETERS_VALUE_BY_NAME).includes(parameter.name))
      .map((parameter) => ({
        parameter: parameter.name,
        value: PARAMETERS_VALUE_BY_NAME[parameter.name],
      }))

    acc[tool.toolSetCode] = {
      ...(acc[tool.toolSetCode] || {}),
      [tool.code]: parameters,
    }

    return acc
  }, {})

const ChatSettingsContext = createContext(null)

const ChatSettingsProvider = ({ children }) => {
  const document = useSelector(documentSelector)
  const documentType = useSelector(documentTypeSelector)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isExpandedView, setIsExpandedView] = useState(false)
  const [activeLLMSettings, setActiveLLMSettings] = useState(null)
  const [pageSpan, setPageSpan] = useState([])
  const [selectedToolIds, setSelectedToolIds] = useState([])
  const [toolsById, setToolsById] = useState({})
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [activeDocumentData, setActiveDocumentData] = useState({ documentId: document._id })
  const [filters, setFilters] = useState(DEFAULT_FILTER)
  const [pagination, setPagination] = useState(DEFAULT_PAGE)
  const [isNewConversationMode, setIsNewConversationMode] = useState(false)

  const PARAMETERS_VALUE_BY_NAME = useMemo(() => {
    const params = { [AgenticAiParameters.DOCUMENT_ID]: document._id }
    if (documentType.code !== UNKNOWN_DOCUMENT_TYPE.code) {
      params[AgenticAiParameters.DOCUMENT_TYPE_ID] = documentType.code
    }

    return params
  }, [document._id, documentType.code])

  const selectedTools = useMemo(
    () => selectedToolIds.map((id) => toolsById[id]).filter(Boolean),
    [selectedToolIds, toolsById],
  )

  const allTools = useMemo(
    () => Object.values(toolsById),
    [toolsById],
  )

  const createContextForSelectedTools = useCallback(() => {
    if (selectedTools.length === 0) {
      return
    }

    return createContextArguments(selectedTools, PARAMETERS_VALUE_BY_NAME)
  }, [
    selectedTools,
    PARAMETERS_VALUE_BY_NAME,
  ])

  const createContextForAllTools = useCallback(() => {
    if (allTools.length === 0) {
      return
    }

    return createContextArguments(allTools, PARAMETERS_VALUE_BY_NAME)
  }, [
    allTools,
    PARAMETERS_VALUE_BY_NAME,
  ])

  const setTitleFilter = useCallback((value) => {
    setFilters((prevFilter) => ({
      ...prevFilter,
      [AgentConversationsFilterKey.TITLE]: value,
    }))
  }, [])

  const toggleExpanded = useCallback(() => {
    setIsExpandedView((expanded) => !expanded)
    if (activeDocumentData?.documentId !== document._id) {
      setActiveDocumentData({ documentId: document._id })
      setActiveConversationId(null)
    }
    setFilters(DEFAULT_FILTER)
    setPagination(DEFAULT_PAGE)
  }, [
    document._id,
    activeDocumentData?.documentId,
  ])

  const openModal = useCallback(() => setIsModalVisible(true), [setIsModalVisible])

  const closeModal = useCallback(() => {
    setIsModalVisible(false)
    setIsNewConversationMode(false)
    setFilters(DEFAULT_FILTER)
    setPagination(DEFAULT_PAGE)
  }, [])

  const value = useMemo(
    () => ({
      activeLLMSettings,
      setActiveLLMSettings,
      selectedToolIds,
      setSelectedToolIds,
      pageSpan,
      setPageSpan,
      toolsById,
      setToolsById,
      createContextForSelectedTools,
      createContextForAllTools,
      isExpandedView,
      isModalVisible,
      closeModal,
      openModal,
      toggleExpanded,
      activeConversationId,
      setActiveConversationId,
      activeDocumentData,
      setActiveDocumentData,
      filters,
      setFilters,
      setTitleFilter,
      isNewConversationMode,
      setIsNewConversationMode,
      pagination,
      setPagination,
    }),
    [
      activeLLMSettings,
      setActiveLLMSettings,
      selectedToolIds,
      setSelectedToolIds,
      pageSpan,
      setPageSpan,
      toolsById,
      setToolsById,
      createContextForSelectedTools,
      createContextForAllTools,
      isExpandedView,
      isModalVisible,
      isNewConversationMode,
      closeModal,
      openModal,
      toggleExpanded,
      activeConversationId,
      setActiveConversationId,
      activeDocumentData,
      setActiveDocumentData,
      filters,
      setTitleFilter,
      setFilters,
      pagination,
    ],
  )

  return (
    <ChatSettingsContext.Provider value={value}>
      {children}
    </ChatSettingsContext.Provider>
  )
}

ChatSettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export {
  ChatSettingsContext,
  ChatSettingsProvider,
}
