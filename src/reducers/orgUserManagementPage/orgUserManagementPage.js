
import { handleActions } from 'redux-actions'
import { storeInviteesMeta, storeWaitingForApprovalUsersMeta, storeDefaultInviteesMeta, storeDefaultWaitingsMeta } from '@/actions/orgUserManagementPage'

const initialState = {
  inviteesTab: null,
  inviteesDefaultMeta: null,
  waitingForApprovalTab: null,
  waitingsDefaultMeta: null,
}

const orgUserManagementPageReducer = handleActions(
  new Map([
    [
      storeInviteesMeta,
      (state, { payload: inviteesTab }) => ({
        ...state,
        inviteesTab,
      }),
    ],
    [
      storeWaitingForApprovalUsersMeta,
      (state, { payload: waitingForApprovalTab }) => ({
        ...state,
        waitingForApprovalTab,
      }),
    ],
    [
      storeDefaultInviteesMeta,
      (state, { payload: inviteesDefaultMeta }) => ({
        ...state,
        inviteesDefaultMeta,
      }),
    ],
    [
      storeDefaultWaitingsMeta,
      (state, { payload: waitingsDefaultMeta }) => ({
        ...state,
        waitingsDefaultMeta,
      }),
    ],
  ]),
  initialState,
)

export {
  orgUserManagementPageReducer,
}
