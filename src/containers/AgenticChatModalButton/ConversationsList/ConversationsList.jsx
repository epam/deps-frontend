
import PropTypes from 'prop-types'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
import { DownOutlined } from '@/components/Icons/DownOutlined'
import { Placement } from '@/enums/Placement'
import { conversationsListItemShape } from '@/models/AgenticChat'
import { documentSelector } from '@/selectors/documentReviewPage'
import { useChatSettings } from '../hooks'
import { InfiniteScrollDocumentsList } from '../InfiniteScrollDocumentsList'
import {
  Collapse,
  Panel,
  List,
  ExpandIcon,
  DocumentTitle,
} from './ConversationsList.styles'
import { ConversationsListItem } from './ConversationsListItem'

const scrollToElement = (element) => {
  requestAnimationFrame(() => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  })
}

const ConversationsList = ({
  conversations,
  documentsIds,
  fetchConversations,
  hasMore,
  isFetching,
}) => {
  const [conversationsByDocumentId, setConversationsByDocumentId] = useState({})
  const [documentsById, setDocumentsById] = useState({})
  const activeItemRef = useRef(null)
  const document = useSelector(documentSelector)

  const {
    activeConversationId,
    activeDocumentData,
    setActiveConversationId,
    setActiveDocumentData,
  } = useChatSettings()

  const currentDocumentConversations = conversationsByDocumentId[document._id]
  const activeDocumentId = activeDocumentData?.documentId

  useEffect(() => {
    setConversationsByDocumentId(conversations)
  }, [conversations])

  useEffect(() => {
    if (activeItemRef.current) {
      scrollToElement(activeItemRef.current)
    }
  }, [documentsIds])

  const selectConversation = useCallback((conversationId, documentId) => {
    const documentData = {
      documentId,
      title: documentsById[documentId],
    }

    setActiveConversationId(conversationId)
    setActiveDocumentData(documentData)
  }, [
    documentsById,
    setActiveConversationId,
    setActiveDocumentData,
  ])

  const updateConversationTitle = useCallback((conversationId, documentId, title) => {
    setConversationsByDocumentId((prevData) => {
      const updatedConversations = prevData[documentId].map((conversation) => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            title,
          }
        }

        return conversation
      })

      return {
        ...prevData,
        [documentId]: updatedConversations,
      }
    })
  }, [])

  const onAfterDelete = useCallback((isActive, siblingConversation) => {
    if (isActive && !siblingConversation) {
      setActiveDocumentData({ documentId: document._id })
    }
    fetchConversations()
  }, [
    fetchConversations,
    document._id,
    setActiveDocumentData,
  ])

  const renderExpandButton = useCallback((panelProps, onClick) => (
    <ExpandIcon
      icon={
        <DownOutlined rotate={panelProps.isActive ? 180 : 0} />
      }
      onClick={onClick}
    />
  ), [])

  const renderPanels = useCallback(() => documentsIds.map((documentId) => {
    const documentConversations = conversationsByDocumentId[documentId]

    if (!documentConversations) {
      return null
    }

    return (
      <Panel
        key={documentId}
        $isActive={documentId === activeDocumentId}
        header={<DocumentTitle text={documentsById[documentId]} />}
      >
        <List>
          {
            documentConversations.map((conversation, index) => {
              const isActive = conversation.id === activeConversationId
              const siblingConversation = documentConversations[index + 1] || documentConversations[index - 1]
              const nextConversation = siblingConversation || currentDocumentConversations?.[0]

              return (
                <ConversationsListItem
                  key={conversation.id}
                  conversationId={conversation.id}
                  conversationTitle={conversation.title}
                  isActive={isActive}
                  itemRef={isActive ? activeItemRef : null}
                  nextConversationId={nextConversation?.id}
                  onAfterDelete={() => onAfterDelete(isActive, siblingConversation)}
                  selectConversation={() => selectConversation(conversation.id, documentId)}
                  updateConversationTitle={(title) => updateConversationTitle(conversation.id, documentId, title)}
                />
              )
            })
          }
        </List>
      </Panel>
    )
  }), [
    activeConversationId,
    activeDocumentId,
    conversationsByDocumentId,
    documentsIds,
    documentsById,
    onAfterDelete,
    selectConversation,
    updateConversationTitle,
    currentDocumentConversations,
  ])

  if (!documentsIds.length) {
    return null
  }

  return (
    <InfiniteScrollDocumentsList
      areConversationsFetching={isFetching}
      documentsById={documentsById}
      documentsIds={documentsIds}
      fetchConversations={fetchConversations}
      hasMore={hasMore}
      setDocumentsById={setDocumentsById}
    >
      <Collapse
        defaultActiveKey={activeDocumentId ? [activeDocumentId] : []}
        placement={Placement.LEFT}
        renderExpandButton={renderExpandButton}
        renderPanels={renderPanels}
      />
    </InfiniteScrollDocumentsList>
  )
}

ConversationsList.propTypes = {
  conversations: PropTypes.objectOf(PropTypes.arrayOf(conversationsListItemShape)).isRequired,
  documentsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchConversations: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
}

export {
  ConversationsList,
}
