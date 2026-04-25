
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Switch, useRouteMatch } from 'react-router-dom'
import { usePolling } from 'use-raf-polling'
import { setStatesToDocuments } from '@/actions/documents'
import { fetchDocumentsByFilter } from '@/actions/documentsListPage'
import { setPagination } from '@/actions/navigation'
import { fetchTableColumns } from '@/actions/system'
import { documentsApi } from '@/api/documentsApi'
import { ErrorBoundRoute } from '@/components/ErrorBoundRoute'
import { DOCUMENTS_PAGE } from '@/constants/automation'
import { PaginationKeys } from '@/constants/navigation'
import { DOCUMENTS_PER_PAGE } from '@/constants/storage'
import { DocumentsTable } from '@/containers/DocumentsTable'
import { DocumentColumn } from '@/containers/DocumentsTable/columns/DocumentColumn'
import { DocumentState } from '@/enums/DocumentState'
import {
  useEventSource,
  KnownBusinessEvent,
} from '@/hooks/useEventSource'
import { usePrevious } from '@/hooks/usePrevious'
import { Localization, localize } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { BASE_DOCUMENTS_FILTER_CONFIG } from '@/models/DocumentsFilterConfig'
import { Pagination } from '@/models/Pagination'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { documentsSelector, documentsTotalSelector } from '@/selectors/documentsListPage'
import { filterSelector } from '@/selectors/navigation'
import { pathNameSelector } from '@/selectors/router'
import { tableColumnsSelector } from '@/selectors/system'
import { ENV } from '@/utils/env'
import { history } from '@/utils/history'
import { defaultShowTotal } from '@/utils/tableUtils'
import { GreetingModal } from './components/GreetingModal'
import { Content } from './DocumentsPage.styles'

const FILTER_ID_KEY = 'filterId'

const POLLING_INTERVAL = 2_000

const COLUMNS_IN_DOCUMENTS_TAB = [
  DocumentColumn.TITLE,
  DocumentColumn.DATE,
  DocumentColumn.DOCUMENT_TYPE,
  DocumentColumn.STATE,
  DocumentColumn.ENGINE,
  DocumentColumn.LABELS,
]

const SHOULD_REFETCH_DOCUMENT_STATES = [
  DocumentState.IDENTIFICATION,
  DocumentState.VERSION_IDENTIFICATION,
  DocumentState.DATA_EXTRACTION,
  DocumentState.NEW,
  DocumentState.UNIFICATION,
  DocumentState.IMAGE_PREPROCESSING,
  DocumentState.PREPROCESSING,
  DocumentState.VALIDATION,
  DocumentState.EXPORTING,
  DocumentState.PARSING,
]

const DocumentsPage = ({
  filters,
  columnsData,
  fetchTableColumns,
  fetchDocumentsByFilter,
  setPagination,
  total,
  user,
  documents,
  setStatesToDocuments,
}) => {
  const match = useRouteMatch()

  const addEvent = useEventSource('DocumentsPage')

  const defaultFilter = useMemo(() => ({
    ...BASE_DOCUMENTS_FILTER_CONFIG,
    ...DefaultPaginationConfig,
  }), [])

  const initialPagination = Pagination.getInitialPagination(DOCUMENTS_PER_PAGE)

  const filterConfig = useMemo(() => {
    return isEmpty(filters)
      ? {
        ...defaultFilter,
        ...initialPagination,
      }
      : {
        ...defaultFilter,
        ...filters,
      }
  }, [
    defaultFilter,
    filters,
    initialPagination,
  ])

  const prevFilters = usePrevious(filterConfig)

  const getAndUpdateDocumentsStates = useCallback(
    async () => {
      if (!documents.length) {
        return
      }

      const { result: currentDocs } = await documentsApi.getDocuments(filterConfig)
      if (
        documents.every((doc) => currentDocs.find((d) => d._id === doc._id)?.state === doc.state)
      ) {
        return
      }
      setStatesToDocuments(currentDocs)
    },
    [
      documents,
      filterConfig,
      setStatesToDocuments,
    ],
  )

  const shouldRefetchDocuments = useMemo(() => (
    !ENV.FEATURE_SERVER_SENT_EVENTS &&
    documents.some((doc) => SHOULD_REFETCH_DOCUMENT_STATES.includes(doc.state))
  ), [documents])

  const { isPolling, restartPolling } = usePolling({
    callback: getAndUpdateDocumentsStates,
    condition: shouldRefetchDocuments,
    interval: POLLING_INTERVAL,
  })

  const onDocumentStateChanged = useCallback((eventData) => {
    if (!documents.some((doc) => doc._id === eventData.documentId)) {
      return
    }

    setStatesToDocuments([{
      _id: eventData.documentId,
      state: eventData.state,
    }])
  }, [documents, setStatesToDocuments])

  useEffect(() => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      return
    }
    addEvent(KnownBusinessEvent.DOCUMENT_STATE_UPDATED, onDocumentStateChanged)
  }, [addEvent, onDocumentStateChanged])

  useEffect(() => {
    fetchTableColumns()
  }, [fetchTableColumns])

  useEffect(() => {
    if (!isEqual(prevFilters, filterConfig)) {
      fetchDocumentsByFilter(filterConfig)
    }
  }, [
    prevFilters,
    filterConfig,
    fetchDocumentsByFilter,
  ])

  const tableColumns = useMemo(() => {
    return columnsData && columnsData.length
      ? columnsData
      : COLUMNS_IN_DOCUMENTS_TAB
  }, [columnsData])

  const refreshData = useCallback(() => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      isPolling && restartPolling()
    }
    fetchDocumentsByFilter(filterConfig)
  }, [fetchDocumentsByFilter, filterConfig, isPolling, restartPolling])

  const pageAndSizeHandler = useCallback((page, size) => {
    Pagination.setSize(DOCUMENTS_PER_PAGE, size)
    setPagination({
      [PaginationKeys.PAGE]: page,
      [PaginationKeys.PER_PAGE]: size,
    })
  }, [setPagination])

  const UserGreetingModal = useMemo(() => {
    if (history.location.state?.showGreeting) {
      history.replace(history.location.pathname, null)

      return (
        <GreetingModal user={user} />
      )
    }
  }, [user])

  const paginationConfig = useMemo(() => {
    const { page, perPage } = filterConfig

    return {
      current: page,
      pageSize: perPage,
      total: total,
      onChange: pageAndSizeHandler,
      onShowSizeChange: pageAndSizeHandler,
      showSizeChanger: !!total,
      showTotal: defaultShowTotal,
    }
  }, [filterConfig, pageAndSizeHandler, total])

  const renderDocumentsTable = () => (
    <DocumentsTable
      defaultFilterConfig={defaultFilter}
      filterConfig={filterConfig}
      pagination={paginationConfig}
      refreshData={refreshData}
      tableColumns={tableColumns}
      tableTitle={localize(Localization.DOCUMENTS)}
    />
  )

  return (
    <>
      {UserGreetingModal}
      <Content
        data-automation={DOCUMENTS_PAGE}
      >
        <Switch>
          <ErrorBoundRoute
            exact
            path={`${match.url}/`}
            render={renderDocumentsTable}
          />
          <ErrorBoundRoute
            path={`${match.url}/:${FILTER_ID_KEY}`}
            render={renderDocumentsTable}
          />
        </Switch>
      </Content>
    </>
  )
}

const mapStateToProps = (state) => ({
  columnsData: tableColumnsSelector(state),
  filters: filterSelector(state) || {},
  pathname: pathNameSelector(state),
  total: documentsTotalSelector(state),
  user: userSelector(state),
  documents: documentsSelector(state),
})

const ConnectedComponent = connect(mapStateToProps, {
  fetchTableColumns,
  fetchDocumentsByFilter,
  setStatesToDocuments,
  setPagination,
})(DocumentsPage)

DocumentsPage.propTypes = {
  columnsData: PropTypes.arrayOf(PropTypes.string),
  fetchTableColumns: PropTypes.func.isRequired,
  fetchDocumentsByFilter: PropTypes.func.isRequired,
  setStatesToDocuments: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    title: PropTypes.string,
    dateRange: PropTypes.arrayOf(PropTypes.string),
    types: PropTypes.arrayOf(PropTypes.string),
    engines: PropTypes.arrayOf(PropTypes.string),
    states: PropTypes.arrayOf(PropTypes.string),
    labels: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setPagination: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  user: userShape.isRequired,
  documents: PropTypes.arrayOf(documentShape).isRequired,
}

export {
  ConnectedComponent as DocumentsPage,
}
