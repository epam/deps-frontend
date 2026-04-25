
import { useState } from 'react'
import { AlertType } from '@/components/Alert'
import { CircleInfoIcon } from '@/components/Icons/CircleInfoIcon'
import { WarningTriangleIcon } from '@/components/Icons/WarningTriangleIcon'
import {
  HAS_SEEN_MERGED_CELLS_NOTICE,
  HAS_SEEN_NO_TABLE_SELECTED_NOTICE,
} from '@/constants/storage'
import { Localization, localize } from '@/localization/i18n'
import { tableLayoutShape } from '@/models/DocumentLayout'
import { localStorageWrapper } from '@/utils/localStorageWrapper'
import { Alert } from './NotificationMessage.styles'

const hasMergedCells = (table) => (
  table.cells.some((cell) => cell.rowSpan > 1 || cell.columnSpan > 1)
)

const shouldShowNotification = (activeTable) => {
  const hasSeenMergedCellsNotice = localStorageWrapper.getItem(HAS_SEEN_MERGED_CELLS_NOTICE)
  const hasSeenNoTableNotice = localStorageWrapper.getItem(HAS_SEEN_NO_TABLE_SELECTED_NOTICE)
  const shouldShowMerged = !hasSeenMergedCellsNotice && activeTable && hasMergedCells(activeTable)
  const shouldShowNoTable = !hasSeenNoTableNotice && !activeTable

  return shouldShowMerged || shouldShowNoTable
}

const NotificationMessage = ({ activeTable }) => {
  const [showNotification, setShowNotification] = useState(
    () => shouldShowNotification(activeTable),
  )

  if (!showNotification) {
    return null
  }

  const handleCloseNoTableNotice = () => {
    setShowNotification(false)
    localStorageWrapper.setItem(HAS_SEEN_NO_TABLE_SELECTED_NOTICE, true)
  }

  const handleCloseMergedCellsNotice = () => {
    setShowNotification(false)
    localStorageWrapper.setItem(HAS_SEEN_MERGED_CELLS_NOTICE, true)
  }

  if (!activeTable) {
    return (
      <Alert
        closable
        description={localize(Localization.NO_TABLE_SELECTED_NOTIFICATION)}
        icon={<WarningTriangleIcon />}
        message={localize(Localization.NO_TABLE_SELECTED)}
        onClose={handleCloseNoTableNotice}
        showIcon
        type={AlertType.WARNING}
      />
    )
  }

  return (
    <Alert
      closable
      description={localize(Localization.MERGED_CELLS_NOTIFICATION)}
      icon={<CircleInfoIcon />}
      message={localize(Localization.MERGED_CELLS_DETECTED)}
      onClose={handleCloseMergedCellsNotice}
      showIcon
      type={AlertType.INFO}
    />
  )
}

NotificationMessage.propTypes = {
  activeTable: tableLayoutShape,
}

export {
  NotificationMessage,
}
