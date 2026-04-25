
import { FileCommandBar } from '../FileCommandBar'

const COLUMN_WIDTH = 55

export const generateFileActionsColumn = () => ({
  render: (file) => (
    <FileCommandBar file={file} />
  ),
  width: COLUMN_WIDTH,
  disableResize: true,
})
