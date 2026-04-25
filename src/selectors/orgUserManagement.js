
import { createSelector } from 'reselect'

const orgUserManagementSelector = (state) => state.orgUserManagement

const orgUserManagementInviteesSelector = createSelector(
  [orgUserManagementSelector],
  (orgUserManagementPage) => orgUserManagementPage.invitees,
)

const orgUserManagementWaitingForApprovalSelector = createSelector(
  [orgUserManagementSelector],
  (orgUserManagementPage) => orgUserManagementPage.waitingForApproval,
)

export {
  orgUserManagementSelector,
  orgUserManagementInviteesSelector,
  orgUserManagementWaitingForApprovalSelector,
}
