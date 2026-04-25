
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useFetchAgentVendorsQuery,
  useFetchModeQuery,
  useLazyFetchConversationsQuery,
} from '@/apiRTK/agenticAiApi'
import { AgentConversationsFilterKey } from '@/constants/navigation'
import { AgenticAiModes } from '@/enums/AgenticAiModes'
import { Localization, localize } from '@/localization/i18n'
import { documentSelector } from '@/selectors/documentReviewPage'
import { notifyWarning } from '@/utils/notification'
import { useChatSettings } from './'

export const useAgenticChatData = () => {
  const [activeAgentVendorId, setActiveAgentVendorId] = useState(null)
  const [conversations, setConversations] = useState({})
  const [documentsIds, setDocumentsIds] = useState([])
  const [total, setTotal] = useState(0)

  const {
    filters,
    isExpandedView,
    setFilters,
    setPagination,
  } = useChatSettings()

  const document = useSelector(documentSelector)

  const [fetchCurrentDocumentConversations, {
    isFetching: areCurrentDocumentConversationsLoading,
    isError: isCurrentDocumentConversationFetchError,
  }] = useLazyFetchConversationsQuery()

  const [fetchDocsConversations, {
    isFetching: areDocumentsConversationsLoading,
    isError: isDocumentsConversationFetchError,
  }] = useLazyFetchConversationsQuery()

  const {
    data: agentVendors,
    isLoading: areAgentVendorsLoading,
    isError: isAgentVendorsFetchError,
  } = useFetchAgentVendorsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const {
    data: modes = [],
    isError: isModesFetchError,
    isLoading: areModesLoading,
  } = useFetchModeQuery({
    code: AgenticAiModes.DOCUMENT,
  }, {
    refetchOnMountOrArgChange: true,
  })

  const updateConversationsState = useCallback((currentDocumentConversations, documentsConversations, page) => {
    const currentDocItems = currentDocumentConversations?.items ?? {}
    const restDocsItems = documentsConversations?.items ?? {}
    const restDocIds = Object.keys(restDocsItems).filter((id) => id !== document._id)

    if (page === 1) {
      setConversations({
        ...currentDocItems,
        ...restDocsItems,
      })
      const hasCurrentDocItems = Object.keys(currentDocItems).length > 0
      setDocumentsIds(hasCurrentDocItems ? [document._id, ...restDocIds] : restDocIds)
      setTotal(documentsConversations?.total ?? 0)
    } else {
      setConversations((prev) => ({
        ...prev,
        ...restDocsItems,
      }))
      setDocumentsIds((prev) => {
        const newDocs = restDocIds.filter((id) => !prev.includes(id))
        return newDocs.length > 0 ? [...prev, ...newDocs] : prev
      })
    }

    setPagination(page)
  }, [document._id, setPagination])

  const fetchConversations = useCallback(async (page = 1) => {
    const currentDocumentConversations = page === 1 ? await fetchCurrentDocumentConversations({
      ...filters,
      [AgentConversationsFilterKey.DOCUMENT_ID]: [document._id],
    }).unwrap() : null

    const documentsConversations = isExpandedView ? await fetchDocsConversations({
      ...filters,
      [AgentConversationsFilterKey.PAGE]: page,
    }).unwrap() : null

    updateConversationsState(currentDocumentConversations, documentsConversations, page)
  }, [
    document._id,
    filters,
    isExpandedView,
    fetchCurrentDocumentConversations,
    fetchDocsConversations,
    updateConversationsState,
  ])

  const {
    isFetching,
    isError,
  } = useMemo(() => ({
    isFetching: (
      areAgentVendorsLoading ||
      areCurrentDocumentConversationsLoading ||
      areDocumentsConversationsLoading ||
      areModesLoading
    ),
    isError: (
      isCurrentDocumentConversationFetchError ||
      isDocumentsConversationFetchError ||
      isAgentVendorsFetchError ||
      isModesFetchError
    ),
  }), [
    areAgentVendorsLoading,
    areCurrentDocumentConversationsLoading,
    areDocumentsConversationsLoading,
    areModesLoading,
    isAgentVendorsFetchError,
    isCurrentDocumentConversationFetchError,
    isDocumentsConversationFetchError,
    isModesFetchError,
  ])

  useEffect(() => {
    if (!activeAgentVendorId) {
      return
    }

    fetchConversations()
  }, [
    activeAgentVendorId,
    fetchConversations,
  ])

  useEffect(() => {
    if (isError) {
      notifyWarning(localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE))
    }
  }, [isError])

  useEffect(() => {
    if (areAgentVendorsLoading || !agentVendors?.length) {
      return
    }

    const activeAgentVendor = agentVendors.find((item) => item.active)

    if (activeAgentVendor) {
      setFilters((prev) => ({
        ...prev,
        [AgentConversationsFilterKey.AGENT_VENDOR_ID]: activeAgentVendor.id,
      }))
      setActiveAgentVendorId(activeAgentVendor.id)
      return
    }

    notifyWarning(localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE))
  }, [areAgentVendorsLoading, agentVendors, setFilters])

  const hasMore = useMemo(() => {
    if (!total || !isExpandedView) {
      return false
    }

    return documentsIds.length < total
  }, [
    total,
    documentsIds.length,
    isExpandedView,
  ])

  return {
    conversations,
    activeAgentVendorId,
    modes,
    isFetching,
    isError,
    documentsIds,
    hasMore,
    fetchConversations,
  }
}
