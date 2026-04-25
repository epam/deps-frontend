
import { createSelector } from 'reselect'

const prototypePageSelector = (state) => state.prototypePage

const keyToAssignSelector = createSelector(
  [prototypePageSelector],
  (prototypePage) => prototypePage.keyToAssign,
)

const activeLayoutIdSelector = createSelector(
  [prototypePageSelector],
  (prototypePage) => prototypePage.activeLayoutId,
)

const activeTableSelector = createSelector(
  [prototypePageSelector],
  (prototypePage) => prototypePage.activeTable,
)

const showTableDrawerSelector = createSelector(
  [prototypePageSelector],
  (prototypePage) => prototypePage.showTableDrawer,
)

export {
  prototypePageSelector,
  keyToAssignSelector,
  activeLayoutIdSelector,
  activeTableSelector,
  showTableDrawerSelector,
}
