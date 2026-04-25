
import { FieldCommandBar } from '../FieldCommandBar'

const COLUMN_WIDTH = 63

const generateFieldActionsColumn = ({ documentType }) => ({
  render: ({ category, ...field }) => (
    <FieldCommandBar
      category={category}
      documentTypeCode={documentType.code}
      field={field}
    />
  ),
  width: COLUMN_WIDTH,
  disableResize: true,
})

export {
  generateFieldActionsColumn,
}
