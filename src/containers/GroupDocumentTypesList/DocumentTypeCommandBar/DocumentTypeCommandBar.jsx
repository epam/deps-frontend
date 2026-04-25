
import { useCallback, memo } from 'react'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { TableActionIcon } from '@/components/TableActionIcon'
import { DeleteDocumentTypesFromGroupButton } from '@/containers/DeleteDocumentTypesFromGroupButton'
import { groupDocumentTypeShape } from '../GroupDocumentType'
import { DocumentTypeCommandsBar } from './DocumentTypeCommandBar.styles'

const DocumentTypeCommandBar = memo(({ documentType }) => {
  const renderTrigger = useCallback((onClick) => (
    <TableActionIcon
      icon={<TrashIcon />}
      onClick={onClick}
    />
  ), [])

  const commands = [
    {
      renderComponent: () => (
        <DeleteDocumentTypesFromGroupButton
          documentTypeIds={[documentType.id]}
          groupId={documentType.groupId}
          renderTrigger={renderTrigger}
        />
      ),
    },
  ]

  return (
    <DocumentTypeCommandsBar commands={commands} />
  )
})

DocumentTypeCommandBar.propTypes = {
  documentType: groupDocumentTypeShape.isRequired,
}

export {
  DocumentTypeCommandBar,
}
