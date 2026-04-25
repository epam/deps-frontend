
import { createSelector } from 'reselect'

const orgUserManagementPageSelector = (state) => state.orgUserManagementPage

const orgUserManagementPageInviteesSelector = createSelector(
  [orgUserManagementPageSelector],
  (orgUserManagementPage) => orgUserManagementPage.inviteesTab,
)

const orgUserManagementPageWaitingForApprovalSelector = createSelector(
  [orgUserManagementPageSelector],
  (orgUserManagementPage) => orgUserManagementPage.waitingForApprovalTab,
)

const orgDefaultInviteesMetaSelector = createSelector(
  [orgUserManagementPageSelector],
  (orgUserManagementPage) => orgUserManagementPage.inviteesDefaultMeta,
)

const orgDefaultWaitingsMetaSelector = createSelector(
  [orgUserManagementPageSelector],
  (orgUserManagementPage) => orgUserManagementPage.waitingsDefaultMeta,
)

export {
  orgUserManagementPageSelector,
  orgUserManagementPageInviteesSelector,
  orgUserManagementPageWaitingForApprovalSelector,
  orgDefaultInviteesMetaSelector,
  orgDefaultWaitingsMetaSelector,
}
