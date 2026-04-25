
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { deleteTemplateVersion } from '@/api/templatesApi'
import { ButtonType } from '@/components/Button'
import { DeleteIconFilled } from '@/components/Icons/DeleteIconFilled'
import { PenIcon } from '@/components/Icons/PenIcon'
import { Modal } from '@/components/Modal'
import { TableActionIcon } from '@/components/TableActionIcon'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { CommandBar } from './TemplateVersionsRowCommands.styles'

const DELETE_BUTTON_TOOLTIP = {
  placement: Placement.TOP,
  title: localize(Localization.DELETE_VERSION),
}

const EDIT_BUTTON_TOOLTIP = {
  placement: Placement.TOP,
  title: localize(Localization.EDIT_VERSION),
}

export const TemplateVersionsRowCommands = ({
  templateId,
  versionId,
  refreshTable,
  setEditableVersionId,
}) => {
  const onDeleteVersionConfirmation = useCallback(
    async () => {
      try {
        await deleteTemplateVersion(templateId, versionId)
        await refreshTable()
      } catch (err) {
        notifyWarning(localize(Localization.DEFAULT_ERROR))
      }
    },
    [templateId, refreshTable, versionId],
  )

  const openDeleteVersionConfirmDialog = useCallback((e) => {
    e.stopPropagation()

    Modal.confirm({
      title: localize(Localization.DELETE_DOCUMENT_TEMPLATE_VERSION_CONFIRM_TITLE),
      content: localize(
        Localization.DELETE_DOCUMENT_TEMPLATE_VERSION_CONFIRM_CONTENT,
      ),
      okText: localize(Localization.YES),
      okType: ButtonType.DANGER,
      cancelText: localize(Localization.NO),
      onOk: onDeleteVersionConfirmation,
    })
  }, [onDeleteVersionConfirmation])

  const setEditableVersion = useCallback((e) => {
    e.stopPropagation()

    setEditableVersionId(versionId)
  }, [setEditableVersionId, versionId])

  const commands = useMemo(() => [
    {
      renderComponent: () => (
        <TableActionIcon
          icon={<PenIcon />}
          onClick={setEditableVersion}
          tooltip={EDIT_BUTTON_TOOLTIP}
        />
      ),
    },
    {
      renderComponent: () => (
        <TableActionIcon
          icon={<DeleteIconFilled />}
          onClick={openDeleteVersionConfirmDialog}
          tooltip={DELETE_BUTTON_TOOLTIP}
        />
      ),
    },
  ], [
    openDeleteVersionConfirmDialog,
    setEditableVersion,
  ])

  return (
    <CommandBar
      commands={commands}
    />
  )
}

TemplateVersionsRowCommands.propTypes = {
  templateId: PropTypes.string.isRequired,
  refreshTable: PropTypes.func.isRequired,
  versionId: PropTypes.string.isRequired,
  setEditableVersionId: PropTypes.func.isRequired,
}
