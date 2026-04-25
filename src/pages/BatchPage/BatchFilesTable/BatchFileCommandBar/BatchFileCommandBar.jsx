
import { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { TableActionIcon } from '@/components/TableActionIcon'
import { DeleteBatchFiles } from '@/containers/DeleteBatchFiles'
import { batchFileMinimizedShape } from '@/models/Batch'
import { selectionSelector } from '@/selectors/navigation'
import { CommandBar } from './BatchFileCommandBar.styles'

const TEST_ID = {
  DELETE_TRIGGER: 'delete-trigger',
}

export const BatchFileCommandBar = ({ file }) => {
  const selectedBatchFiles = useSelector(selectionSelector)

  const renderTrigger = useCallback((onClick) => (
    <TableActionIcon
      data-testid={TEST_ID.DELETE_TRIGGER}
      disabled={!!selectedBatchFiles.length}
      icon={<TrashIcon />}
      onClick={onClick}
    />
  ), [selectedBatchFiles.length])

  const commands = useMemo(() => [
    {
      renderComponent: () => (
        <DeleteBatchFiles
          file={file}
          renderTrigger={renderTrigger}
        />
      ),
    },
  ], [file, renderTrigger])

  return (
    <CommandBar commands={commands} />
  )
}

BatchFileCommandBar.propTypes = {
  file: batchFileMinimizedShape.isRequired,
}
