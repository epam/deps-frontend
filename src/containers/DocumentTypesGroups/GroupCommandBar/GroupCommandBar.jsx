
import { useMemo, useCallback } from 'react'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { TableActionIcon } from '@/components/TableActionIcon'
import { DeleteDocumentTypesGroupButton } from '@/containers/DeleteDocumentTypesGroupButton'
import { documentTypesGroupShape } from '@/models/DocumentTypesGroup'
import { CommandBar } from './GroupCommandBar.styles'

const GroupCommandBar = ({ group }) => {
  const renderTrigger = useCallback((onClick) => (
    <TableActionIcon
      icon={<TrashIcon />}
      onClick={onClick}
    />
  ), [])

  const commands = useMemo(() => [
    {
      renderComponent: () => (
        <DeleteDocumentTypesGroupButton
          group={group}
          renderTrigger={renderTrigger}
        />
      ),
    },
  ], [group, renderTrigger])

  return (
    <CommandBar commands={commands} />
  )
}

GroupCommandBar.propTypes = {
  group: documentTypesGroupShape.isRequired,
}

export {
  GroupCommandBar,
}
