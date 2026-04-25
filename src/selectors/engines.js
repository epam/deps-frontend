
import get from 'lodash/get'
import { createSelector } from 'reselect'

const enginesSelector = (state) => get(state, 'engines')

const ocrEnginesSelector = createSelector(
  [enginesSelector],
  (engines) => get(engines, 'ocr'),
)

const tableEnginesSelector = createSelector(
  [enginesSelector],
  (engines) => get(engines, 'table'),
)

export {
  enginesSelector,
  ocrEnginesSelector,
  tableEnginesSelector,
}
