
import { createAction } from 'redux-actions'
import { createRequestAction } from '@/actions/requests'
import { iamApi } from '@/api/iamApi'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'

const FEATURE_NAME = 'ORG_USER_MANAGEMENT_PAGE'

const storeInviteesMeta = createAction(
  `${FEATURE_NAME}/STORE_INVITEES_META`,
)

const storeOrganisationUsersMeta = createAction(
  `${FEATURE_NAME}/STORE_ORGANISATION_USERS_META`,
)

const storeWaitingForApprovalUsersMeta = createAction(
  `${FEATURE_NAME}/STORE_WAITING_FOR_APPROVAL_USERS_META`,
)

const storeDefaultInviteesMeta = createAction(
  `${FEATURE_NAME}/STORE_DEFAULT_INVITEES_META`,
)

const storeDefaultWaitingsMeta = createAction(
  `${FEATURE_NAME}/STORE_DEFAULT_WAITINGS_META`,
)

const fetchDefaultInviteesMeta = createRequestAction(
  'fetchDefaultInviteesMeta',
  (orgPk) => async (dispatch) => {
    const data = await iamApi.invitedUsers(orgPk, DefaultPaginationConfig)
    dispatch(storeDefaultInviteesMeta(data.meta))

    return data
  },
)

const fetchDefaultWaitingsMeta = createRequestAction(
  'fetchDefaultWaitingsMeta',
  (orgPk) => async (dispatch) => {
    const { meta } = await iamApi.waitingForApproval(orgPk, DefaultPaginationConfig)
    dispatch(storeDefaultWaitingsMeta(meta))
  },
)

export {
  storeInviteesMeta,
  storeOrganisationUsersMeta,
  storeWaitingForApprovalUsersMeta,
  fetchDefaultInviteesMeta,
  fetchDefaultWaitingsMeta,
  storeDefaultInviteesMeta,
  storeDefaultWaitingsMeta,
}
