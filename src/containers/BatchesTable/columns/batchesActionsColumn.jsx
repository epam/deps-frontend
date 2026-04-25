
import { BatchesCommandBar } from '../BatchesCommandBar'

const COLUMN_WIDTH = 44

const generateActionsColumn = () => ({
  render: (batch) => (
    <BatchesCommandBar batch={batch} />
  ),
  width: COLUMN_WIDTH,
  disableResize: true,
})

export {
  generateActionsColumn,
}
