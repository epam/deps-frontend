
import { mockSelector } from '@/mocks/mockSelector'
import { TableCellLayout, TableLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'

const mockKey = 'mockKey'
const mockLayoutId = 'mockLayoutId'

const mockCell = new TableCellLayout({
  content: 'Cell content',
  kind: 'kind',
  columnIndex: 0,
  columnSpan: 1,
  rowIndex: 0,
  rowSpan: 1,
  page: 2,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockTable = new TableLayout({
  id: 'id',
  order: 1,
  cells: [mockCell],
  confidence: 0,
  columnCount: 1,
  rowCount: 1,
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const prototypePageSelector = mockSelector({
  keyToAssign: mockKey,
})

const keyToAssignSelector = mockSelector(mockKey)

const activeLayoutIdSelector = mockSelector(mockLayoutId)

const activeTableSelector = mockSelector(mockTable)

const showTableDrawerSelector = mockSelector(false)

export {
  activeTableSelector,
  prototypePageSelector,
  keyToAssignSelector,
  activeLayoutIdSelector,
  showTableDrawerSelector,
}
