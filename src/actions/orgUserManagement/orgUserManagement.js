
import { createAction } from 'redux-actions'
import {
  storeInviteesMeta,
  storeWaitingForApprovalUsersMeta,
} from '@/actions/orgUserManagementPage'
import { createRequestAction } from '@/actions/requests'
import { iamApi } from '@/api/iamApi'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'

const FEATURE_NAME = 'ORG_USER_MANAGMENT'

const storeInvitees = createAction(
  `${FEATURE_NAME}/STORE_INVITEES`,
)

const storeWaitingForApprovalUsers = createAction(
  `${FEATURE_NAME}/STORE_WAITING_FOR_APPROVAL_USERS`,
)

const fetchInvitedUsersByFilter = createRequestAction(
  'fetchInvitedUsersByFilter',
  (orgPk, filters = DefaultPaginationConfig) => async (dispatch) => {
    const { result, meta } = await iamApi.invitedUsers(orgPk, filters)
    dispatch(storeInvitees(result))
    dispatch(storeInviteesMeta(meta))
  },
)

const fetchWaitingForApprovalUsersByFilter = createRequestAction(
  'fetchWaitingForApprovalUsersByFilter',
  (orgPk, filters = DefaultPaginationConfig) => async (dispatch) => {
    const { result, meta } = await iamApi.waitingForApproval(orgPk, filters)
    dispatch(storeWaitingForApprovalUsers(result))
    dispatch(storeWaitingForApprovalUsersMeta(meta))
  },
)

export {
  storeInvitees,
  fetchInvitedUsersByFilter,
  storeWaitingForApprovalUsers,
  fetchWaitingForApprovalUsersByFilter,
}
