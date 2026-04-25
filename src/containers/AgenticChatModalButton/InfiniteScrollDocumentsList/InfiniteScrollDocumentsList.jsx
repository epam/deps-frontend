
import PropTypes from 'prop-types'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { documentsApi } from '@/api/documentsApi'
import { Spin } from '@/components/Spin'
import { DocumentFilterKeys, PaginationKeys } from '@/constants/navigation'
import { InfiniteScroll } from '@/containers/InfiniteScroll'
import { useAbortRequest } from '@/hooks/useAbortRequest'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { childrenShape } from '@/utils/propTypes'
import { DOCUMENTS_LIST_PER_PAGE } from '../constants'
import { useChatSettings } from '../hooks'

const groupDocumentsByDocId = (documentsById, documentsDetails) => ({
  ...documentsById,
  ...Object.fromEntries(documentsDetails.map(({ _id, title }) => [_id, title])),
})

const InfiniteScrollDocumentsList = ({
  areConversationsFetching,
  children,
  documentsById,
  documentsIds,
  fetchConversations,
  setDocumentsById,
  hasMore,
}) => {
  const [areDocumentsFetching, setAreDocumentsFetching] = useState(false)
  const prevDocumentsIds = useRef(null)

  const { signal, isCanceled } = useAbortRequest()
  const { pagination } = useChatSettings()

  const isFetching = areConversationsFetching || areDocumentsFetching

  const fetchDocumentsDetails = useCallback(async (batchIds) => {
    if (!batchIds.length) {
      return
    }

    setAreDocumentsFetching(true)

    try {
      const ids = batchIds.filter((id) => !documentsById[id])

      if (ids.length) {
        const documentsList = await documentsApi.getDocuments({
          [DocumentFilterKeys.FILTER_IDS]: ids,
          [PaginationKeys.PER_PAGE]: DOCUMENTS_LIST_PER_PAGE,
        }, { signal })

        if (signal.aborted) {
          return
        }

        setDocumentsById((prev) => groupDocumentsByDocId(prev, documentsList.result))
      }
    } catch (e) {
      if (isCanceled(e)) {
        return
      }

      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      if (!signal.aborted) {
        setAreDocumentsFetching(false)
      }
    }
  }, [
    documentsById,
    setDocumentsById,
    signal,
    isCanceled,
  ])

  useEffect(() => {
    const documentsIdsString = JSON.stringify(documentsIds)

    if (prevDocumentsIds.current === documentsIdsString) {
      return
    }

    prevDocumentsIds.current = documentsIdsString
    fetchDocumentsDetails(documentsIds)
  }, [
    documentsIds,
    fetchDocumentsDetails,
  ])

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore) {
      return
    }

    await fetchConversations(pagination + 1)
  }, [
    isFetching,
    hasMore,
    fetchConversations,
    pagination,
  ])

  return (
    <>
      {children}
      {
        isFetching
          ? <Spin spinning />
          : <InfiniteScroll loadMore={loadMore} />
      }
    </>
  )
}

InfiniteScrollDocumentsList.propTypes = {
  areConversationsFetching: PropTypes.bool.isRequired,
  children: childrenShape.isRequired,
  documentsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  documentsById: PropTypes.objectOf(PropTypes.string).isRequired,
  fetchConversations: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  setDocumentsById: PropTypes.func.isRequired,
}

export {
  InfiniteScrollDocumentsList,
}
