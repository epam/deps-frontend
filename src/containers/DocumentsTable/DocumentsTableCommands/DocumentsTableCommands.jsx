
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { deleteDocuments } from '@/actions/documents'
import { setSelection } from '@/actions/navigation'
import { ButtonType, Button } from '@/components/Button'
import { ArrowsRotate } from '@/components/Icons/ArrowsRotate'
import { DeleteIconFilled } from '@/components/Icons/DeleteIconFilled'
import { GearIcon } from '@/components/Icons/GearIcon'
import { ResetFiltrationIcon } from '@/components/Icons/ResetFiltrationIcon'
import { TagIcon } from '@/components/Icons/TagIcon'
import { Modal } from '@/components/Modal'
import { Tooltip } from '@/components/Tooltip'
import {
  ADD_LABEL_BUTTON,
  DELETE_DOCUMENT_BUTTON,
  REFRESH_DATA_BUTTON,
} from '@/constants/automation'
import { ManageLabelsModalButton } from '@/containers/ManageLabelsModalButton'
import { TableColumnsPicker } from '@/containers/TableColumnsPicker'
import { localize, Localization } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { documentsFilterConfigShape } from '@/models/DocumentsFilterConfig'
import { documentsSelector } from '@/selectors/documentsListPage'
import { filterSelector } from '@/selectors/navigation'
import { ENV } from '@/utils/env'
import { DocumentTableCommandsBar, Separator } from './DocumentsTableCommands.styles'
import { DownloadMenuCommand } from './DownloadMenuCommand'
import { MoreOptionsCommandMenu } from './MoreOptionsCommandMenu'

const DocumentsTableCommands = ({
  documents,
  checkedDocuments,
  deleteDocuments,
  setSelection,
  resetFilters,
  refreshData,
  tableColumns,
  filterConfig,
}) => {
  const selectedDocuments = useMemo(
    () => documents.filter((d) =>
      checkedDocuments.find((id) => d._id === id)),
    [
      checkedDocuments,
      documents,
    ],
  )

  const areSelectedWithAttachments = useMemo(
    () => selectedDocuments.some((d) => d?.containerMetadata?.firstLevelChildCount > 0),
    [selectedDocuments],
  )

  const deleteDocument = useCallback(async () => {
    await deleteDocuments(checkedDocuments, filterConfig.parentId)
    setSelection([])
  }, [
    checkedDocuments,
    deleteDocuments,
    filterConfig,
    setSelection,
  ])

  const onDeleteClick = useCallback(() => Modal.confirm({
    title: localize(Localization.DELETE_CONFIRM_TITLE),
    content: areSelectedWithAttachments
      ? localize(Localization.DELETE_EMAIL_WITH_ATTACHMENTS_DESCRIPTION)
      : localize(Localization.DELETE_DOCUMENT_DESCRIPTION),
    okText: localize(Localization.DELETE),
    okType: ButtonType.DANGER,
    cancelText: localize(Localization.CANCEL),
    onOk: deleteDocument,
  }), [deleteDocument, areSelectedWithAttachments])

  const renderManageLabelsTrigger = useCallback((onCLick) => (
    <Tooltip title={localize(Localization.MANAGE_LABELS)}>
      <Button.Secondary
        data-automation={ADD_LABEL_BUTTON}
        disabled={!checkedDocuments.length}
        icon={<TagIcon />}
        onClick={onCLick}
      />
    </Tooltip>
  ), [checkedDocuments.length])

  const documentCommands = useMemo(
    () => [
      {
        renderComponent: () => (
          <ManageLabelsModalButton
            documentIds={checkedDocuments}
            renderTrigger={renderManageLabelsTrigger}
          />
        ),
      },
      {
        renderComponent: () => (
          <DownloadMenuCommand
            checkedDocuments={checkedDocuments}
            documents={documents}
          />
        ),
      },
      {
        renderComponent: ENV.FEATURE_DOCUMENT_DELETE && (
          () => (
            <Tooltip title={localize(Localization.DELETE_DOCUMENT)}>
              <Button.Secondary
                data-automation={DELETE_DOCUMENT_BUTTON}
                disabled={!checkedDocuments.length}
                icon={<DeleteIconFilled />}
              />
            </Tooltip>
          )
        ),
        onClick: onDeleteClick,
      },
      {
        renderComponent: () => (
          <MoreOptionsCommandMenu
            selectedDocuments={selectedDocuments}
          />
        ),
      },
    ].filter((command) => !!command.renderComponent),
    [
      documents,
      selectedDocuments,
      checkedDocuments,
      onDeleteClick,
      renderManageLabelsTrigger,
    ],
  )

  const tableCommands = useMemo(() => ([
    {
      renderComponent: () => (
        <Tooltip title={localize(Localization.REFRESH_DATA)}>
          <Button.Secondary
            data-automation={REFRESH_DATA_BUTTON}
            icon={<ArrowsRotate />}
            onClick={refreshData}
          />
        </Tooltip>
      ),
    },
    {
      renderComponent: () => (
        <Tooltip title={localize(Localization.RESET_FILTERS)}>
          <Button.Secondary
            icon={<ResetFiltrationIcon />}
            onClick={resetFilters}
          />
        </Tooltip>
      ),
    },
    {
      renderComponent: () => (
        <TableColumnsPicker
          columns={tableColumns}
        >
          <Tooltip title={localize(Localization.TABLE_SETTING)}>
            <Button.Secondary
              icon={<GearIcon />}
            />
          </Tooltip>
        </TableColumnsPicker>
      ),
    },
  ]), [
    refreshData,
    resetFilters,
    tableColumns,
  ])

  const getContainer = (trigger) =>
    trigger.parentNode.parentNode.parentNode.parentNode.parentNode

  return (
    <>
      {
        !!checkedDocuments.length && (
          <>
            <DocumentTableCommandsBar
              commands={documentCommands}
              getPopupContainer={getContainer}
            />
            <Separator />
          </>
        )
      }
      <DocumentTableCommandsBar
        commands={tableCommands}
      />
    </>
  )
}

DocumentsTableCommands.propTypes = {
  documents: PropTypes.arrayOf(documentShape).isRequired,
  checkedDocuments: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterConfig: documentsFilterConfigShape.isRequired,
  deleteDocuments: PropTypes.func.isRequired,
  setSelection: PropTypes.func.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  refreshData: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  filters: filterSelector(state),
  documents: documentsSelector(state),
})

const mergeProps = (stateProps, { dispatch }, ownProps) => ({
  ...stateProps,
  ...ownProps,
  deleteDocuments: (docs, parentId) => dispatch(deleteDocuments(docs, parentId)),
  setSelection: (selection) => dispatch(setSelection(selection)),
})

const ConnectedComponent = connect(mapStateToProps, null, mergeProps)(DocumentsTableCommands)

export {
  ConnectedComponent as DocumentsTableCommands,
}
