
import { handleActions } from 'redux-actions'
import {
  storeInvitees,
  storeWaitingForApprovalUsers,
} from '@/actions/orgUserManagement'

const initialState = {
  invitees: [],
  waitingForApproval: [],
}

const orgUserManagementReducer = handleActions(
  new Map([
    [
      storeInvitees,
      (state, { payload: invitees }) => ({
        ...state,
        invitees,
      }),
    ],
    [
      storeWaitingForApprovalUsers,
      (state, { payload: waitingForApproval }) => ({
        ...state,
        waitingForApproval,
      }),
    ],
  ]),
  initialState,
)

export {
  orgUserManagementReducer,
}
