
import { BatchFileCommandBar } from '@/pages/BatchPage/BatchFilesTable/BatchFileCommandBar'

const COLUMN_WIDTH = 65

export const generateBatchFileActionsColumn = () => ({
  render: (file) => <BatchFileCommandBar file={file} />,
  width: COLUMN_WIDTH,
  disableResize: true,
})
