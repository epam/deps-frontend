
import { mockSelector } from '@/mocks/mockSelector'

const buildDateSelector = mockSelector('2020-01-01T09:34:24.249Z')
const commitHashSelector = mockSelector('commitHash')

export {
  buildDateSelector,
  commitHashSelector,
}
