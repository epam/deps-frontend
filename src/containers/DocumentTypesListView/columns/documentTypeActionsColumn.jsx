
import { DocumentTypeCommandBar } from '@/containers/DocumentTypeCommandBar'

const COLUMN_WIDTH = 43

const generateDocumentTypeActionsColumn = () => ({
  title: '',
  render: (_, record) => (
    <DocumentTypeCommandBar
      code={record.code}
    />
  ),
  width: COLUMN_WIDTH,
  disableResize: true,
})

export {
  generateDocumentTypeActionsColumn,
}
