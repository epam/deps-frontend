
import { handleActions } from 'redux-actions'
import { storeDocumentsIds } from '@/actions/documentsListPage'

const initialState = {
  ids: [],
  total: 0,
}

const documentsListPageReducer = handleActions(
  new Map([
    [
      storeDocumentsIds,
      (state, { payload: { ids, total } }) => ({
        ...state,
        ids,
        total,
      }),
    ],
  ]),
  initialState,
)

export {
  initialState,
  documentsListPageReducer,
}
