
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { fetchDocumentsByFilter } from '@/actions/documentsListPage'
import { ButtonType } from '@/components/Button'
import { Empty } from '@/components/Empty'
import { Expander } from '@/components/Expander'
import { EmptyIcon } from '@/components/Icons/EmptyIcon'
import { TogglerButton } from '@/components/TogglerButton'
import { DocumentsTable } from '@/containers/DocumentsTable'
import { DocumentColumn } from '@/containers/DocumentsTable/columns/DocumentColumn'
import { localize, Localization } from '@/localization/i18n'
import { BASE_DOCUMENTS_FILTER_CONFIG } from '@/models/DocumentsFilterConfig'
import { Link } from '@/pages/EmailReviewPage/Link.styles'
import { idSelector } from '@/selectors/documentReviewPage'
import { documentsTotalSelector } from '@/selectors/documentsListPage'
import { filterSelector } from '@/selectors/navigation'
import { tableColumnsSelector } from '@/selectors/system'
import {
  EmailAttachmentsWrapper,
  EmptyContainer,
} from './EmailAttachments.styles'

const ATTACHMENT_COLUMNS = [
  DocumentColumn.TITLE,
  DocumentColumn.DATE,
  DocumentColumn.ENGINE,
  DocumentColumn.DOCUMENT_TYPE,
  DocumentColumn.LABELS,
  DocumentColumn.STATE,
]

const EmailAttachments = ({
  filters,
  total,
  documentId,
  fetchDocumentsByFilter,
  columnsData,
}) => {
  const defaultFilter = useMemo(() => ({
    ...BASE_DOCUMENTS_FILTER_CONFIG,
    parentId: documentId,
  }), [documentId])

  const getFilterConfig = useCallback(() => ({
    ...defaultFilter,
    ...filters,
  }), [defaultFilter, filters])

  useEffect(() => {
    fetchDocumentsByFilter(getFilterConfig())
  }, [fetchDocumentsByFilter, getFilterConfig])

  const refreshData = useCallback(() => {
    fetchDocumentsByFilter(getFilterConfig())
  }, [fetchDocumentsByFilter, getFilterConfig])

  const tableColumns = useMemo(() => {
    return columnsData && columnsData.length
      ? columnsData
      : ATTACHMENT_COLUMNS
  }, [columnsData])

  const renderAttachments = useCallback((collapsed) => {
    if (isEmpty(filters) && total === 0) {
      return (
        <EmptyContainer>
          <Empty
            description={localize(Localization.NO_ATTACHMENT_TEXT)}
            image={<EmptyIcon />}
          />
        </EmptyContainer>
      )
    }

    return (
      <DocumentsTable
        collapsed={collapsed}
        defaultFilterConfig={defaultFilter}
        filterConfig={getFilterConfig()}
        pagination={false}
        refreshData={refreshData}
        tableColumns={tableColumns}
      />
    )
  }, [
    defaultFilter,
    filters,
    getFilterConfig,
    refreshData,
    tableColumns,
    total,
  ])

  return (
    <Expander>
      {
        (collapsed, toggleCollapse) => (
          <>
            <TogglerButton
              block
              collapsed={collapsed}
              onClick={toggleCollapse}
              title={localize(Localization.ATTACHMENTS_NAME)}
              type={ButtonType.TEXT}
            />
            <EmailAttachmentsWrapper>
              {renderAttachments(collapsed)}
              {
                collapsed && (
                  <Link
                    onClick={toggleCollapse}
                  >
                    {localize(Localization.VIEW_MORE)}
                  </Link>
                )
              }
            </EmailAttachmentsWrapper>
          </>
        )
      }
    </Expander>
  )
}

EmailAttachments.propTypes = {
  documentId: PropTypes.string,
  fetchDocumentsByFilter: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    title: PropTypes.string,
    dateRange: PropTypes.arrayOf(PropTypes.string),
    sources: PropTypes.arrayOf(PropTypes.string),
    types: PropTypes.arrayOf(PropTypes.string),
    engines: PropTypes.arrayOf(PropTypes.string),
    states: PropTypes.arrayOf(PropTypes.string),
    labels: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  columnsData: PropTypes.arrayOf(PropTypes.string),
  total: PropTypes.number.isRequired,
}

const mapStateToProps = (state) => ({
  documentId: idSelector(state),
  columnsData: tableColumnsSelector(state),
  filters: filterSelector(state) || {},
  total: documentsTotalSelector(state),
})

const ConnectedComponent = connect(mapStateToProps, {
  fetchDocumentsByFilter,
})(EmailAttachments)

export {
  ConnectedComponent as EmailAttachments,
}
