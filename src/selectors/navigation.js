
import get from 'lodash/get'
import { createSelector } from 'reselect'
import { FILTERS, PAGINATION, SELECTED_RECORDS } from '@/constants/navigation'
import { searchParamsSelector } from '@/selectors/router'

const navigationRootSelector = (state) => get(state, 'navigation')

const filterSelector = createSelector(
  [searchParamsSelector],
  (searchParams) => {
    return {
      ...searchParams[FILTERS],
      ...searchParams[PAGINATION],
    }
  },
)

const selectionSelector = createSelector(
  [searchParamsSelector],
  (searchParams) => searchParams[SELECTED_RECORDS] || [],
)

const navigationSelector = (state, key) => {
  return state.navigation[key] || {}
}

const uiSelector = createSelector(
  [navigationRootSelector],
  (navigation) => get(navigation, 'ui'),
)

export {
  uiSelector,
  filterSelector,
  selectionSelector,
  navigationSelector,
}
