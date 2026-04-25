
import has from 'lodash/has'
import { createAction } from 'redux-actions'
import { SELECTED_RECORDS, FILTERS, PAGINATION, UiKeys } from '@/constants/navigation'
import { navigationSelector } from '@/selectors/navigation'
import { pathNameSelector, searchSelector } from '@/selectors/router'
import { history } from '@/utils/history'
import { searchParamsToQueryString } from '@/utils/queryString'

const FEATURE_NAME = 'NAVIGATION'

export const setUi = createAction(
  `${FEATURE_NAME}/SET_UI`,
)

export const setFilters = (filters) => (dispatch, getState) => {
  const pathname = pathNameSelector(getState())
  dispatch(goTo(pathname, { [FILTERS]: filters }))
}

export const setPagination = (pagination) => (dispatch, getState) => {
  const pathname = pathNameSelector(getState())
  dispatch(goTo(pathname, { [PAGINATION]: pagination }))
}

export const setSelection = (selection) => (dispatch, getState) => {
  const pathname = pathNameSelector(getState())
  dispatch(goTo(pathname, { [SELECTED_RECORDS]: selection }))
}

export const setScrollId = (id) => (dispatch) => {
  dispatch(setUi({
    [UiKeys.SCROLL_ID]: id,
  }))
}

export const goTo = (pathname, config) => (dispatch, getState) => {
  const state = getState()
  const navigation = navigationSelector(state, pathname)

  if (has(config, [FILTERS])) {
    navigation[FILTERS] = config[FILTERS]
  }

  if (has(config, [PAGINATION])) {
    navigation[PAGINATION] = config[PAGINATION]
  }

  if (has(config, [SELECTED_RECORDS])) {
    navigation[SELECTED_RECORDS] = config[SELECTED_RECORDS]
  }

  const currentUrl = `${pathNameSelector(state)}${searchSelector(state)}`
  const nextUrl = `${pathname}${searchParamsToQueryString(navigation)}`
  if (currentUrl === nextUrl) {
    return
  }

  history.push(nextUrl)
}
