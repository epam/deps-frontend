
import { LOCATION_CHANGE } from 'connected-react-router'
import { setUi } from '@/actions/navigation'
import { SELECTED_RECORDS, FILTERS, PAGINATION, DocumentFilterKeys, PaginationKeys, UiKeys } from '@/constants/navigation'
import { navigationReducer } from '@/reducers/navigation'
import { initialState } from '@/reducers/navigation/navigation'
import { navigationMap } from '@/utils/navigationMap'

describe('Reducer: navigation', () => {
  describe('Action handler: LOCATION_CHANGE', () => {
    it('should set default values in case empty search', () => {
      const action = {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: navigationMap.documents(),
            search: '',
          },
        },
      }

      const stateAfter = {
        ...initialState,
        ui: {},
        [action.payload.location.pathname]: {
          [FILTERS]: {},
          [PAGINATION]: {},
          [SELECTED_RECORDS]: [],
        },
      }

      expect(navigationReducer(initialState, action)).toEqual(stateAfter)
    })

    it('should set correct values for all navigation keys according to the search and pathName', () => {
      const action = {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: navigationMap.documents(),
            search: '?filters=%7B%22states%22%3A%5B%22completed%22%5D%7D&pagination=%7B%22page%22%3A1%2C%22perPage%22%3A2%7D&selection=%5B%224%22%2C%223%22%5D',
          },
        },
      }
      const stateAfter = {
        ...initialState,
        ui: {},
        [action.payload.location.pathname]: {
          [FILTERS]: {
            [DocumentFilterKeys.STATES]: ['completed'],
          },
          [PAGINATION]: {
            [PaginationKeys.PAGE]: 1,
            [PaginationKeys.PER_PAGE]: 2,
          },
          [SELECTED_RECORDS]: ['4', '3'],
        },
      }
      expect(navigationReducer(initialState, action)).toEqual(stateAfter)
    })
  })

  describe('Action handler: setUi', () => {
    it('should add new uiConfig to the state object', () => {
      const initialState = {
        ui: {
          [UiKeys.ACTIVE_PAGE]: 1,
          [UiKeys.RECT_COORDS]: [{
            left: 0,
            top: 1,
            width: 2,
            height: 3,
          }],
        },
      }

      const uiConfig = { [UiKeys.ACTIVE_PAGE]: 20 }
      const action = setUi(uiConfig)

      expect(navigationReducer(initialState, action)).toEqual({
        ...initialState,
        ui: {
          ...initialState.ui,
          ...uiConfig,
        },
      })
    })
  })
})
