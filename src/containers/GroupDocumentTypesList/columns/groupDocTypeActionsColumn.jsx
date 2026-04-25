
import { DocumentTypeCommandBar } from '../DocumentTypeCommandBar'

const COLUMN_WIDTH = 22

const generateDocTypeActionsColumn = () => ({
  render: (dt) => (
    <DocumentTypeCommandBar documentType={dt} />
  ),
  width: COLUMN_WIDTH,
  disableResize: true,
})

export {
  generateDocTypeActionsColumn,
}
