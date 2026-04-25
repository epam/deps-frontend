
import { LOCATION_CHANGE } from 'connected-react-router'
import { handleActions } from 'redux-actions'
import { setUi } from '@/actions/navigation'
import { SELECTED_RECORDS, FILTERS, PAGINATION } from '@/constants/navigation'
import { navigationMap } from '@/utils/navigationMap'
import { queryStringToSearchParams } from '@/utils/queryString'

export const initialState = {
  ui: {},
}

const previousPathNameHandler = (() => {
  const pathHistory = []

  return (action) => {
    const goToPathName = action.payload.location.pathname
    const currPathName = pathHistory[pathHistory.length - 1] ?? navigationMap.home()
    const prevPathName = pathHistory[pathHistory.length - 2]

    if (goToPathName === currPathName) {
      return prevPathName ?? navigationMap.home()
    }

    if (prevPathName && goToPathName === prevPathName) {
      pathHistory.length = pathHistory.length - 2
      pathHistory.push(goToPathName)
      return pathHistory[pathHistory.length - 2] ?? pathHistory[0]
    }

    pathHistory.push(goToPathName)

    return currPathName
  }
})()

const locationChangeHandler = (state, action) => {
  const searchParams = queryStringToSearchParams(action.payload.location.search)
  const previousPathName = previousPathNameHandler(action)
  const currentPath = action.payload.location.pathname.replace(navigationMap.labelingTool(), '')
  const prevPath = previousPathName.replace(navigationMap.labelingTool(), '')

  const ui = currentPath !== prevPath ? {} : state.ui

  const selection = searchParams[SELECTED_RECORDS] || []
  const pagination = searchParams[PAGINATION] || {}
  const filters = searchParams[FILTERS] || {}
  const newState = {
    ...state,
    ui,
    [action.payload.location.pathname]: {
      [FILTERS]: filters,
      [PAGINATION]: pagination,
      [SELECTED_RECORDS]: selection,
    },
  }
  return newState
}

const setUiHandler = (state, action) => {
  const newState = {
    ...state,
    ui: {
      ...state.ui,
      ...action.payload,
    },
  }

  return newState
}

const navigationReducer = handleActions(
  new Map([
    [
      LOCATION_CHANGE,
      locationChangeHandler,
    ],
    [
      setUi,
      setUiHandler,
    ],
  ]),
  initialState,
)

export {
  navigationReducer,
}
