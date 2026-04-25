
import { handleActions } from 'redux-actions'
import { storeFields } from '@/actions/genAiData'

const initialState = {}

const genAiDataReducer = handleActions(
  new Map([
    [
      storeFields,
      (state, { payload: { documentId, fields } }) => (
        {
          ...state,
          [documentId]: fields,
        }
      ),
    ],
  ]),
  initialState,
)

export {
  genAiDataReducer,
}
