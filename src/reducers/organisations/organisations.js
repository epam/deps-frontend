
import { handleActions } from 'redux-actions'
import { storeOrganisations } from '@/actions/organisations'

const initialState = []

const organisationsReducer = handleActions(
  new Map([
    [
      storeOrganisations,
      (state, { payload }) => payload,
    ],
  ]),
  initialState,
)

export {
  organisationsReducer,
}
