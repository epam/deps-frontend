
import { GroupCommandBar } from '../GroupCommandBar'

const COLUMN_WIDTH = 33

const generateGroupActionsColumn = () => ({
  render: (group) => (
    <GroupCommandBar group={group} />
  ),
  width: COLUMN_WIDTH,
  disableResize: true,
})

export {
  generateGroupActionsColumn,
}
