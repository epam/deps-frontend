
import { mockSelector } from '@/mocks/mockSelector'

const orgUserManagementPageInviteesSelector = mockSelector({
  total: 5,
  size: 10,
})

const orgUserManagementPageSelector = mockSelector({
  inviteesTab: {
    total: 5,
    size: 10,
  },
  waitingForApprovalTab: {
    total: 5,
    size: 10,
  },
})

const orgUserManagementPageWaitingForApprovalSelector = mockSelector({
  total: 2,
  size: 2,
})

const orgDefaultInviteesMetaSelector = mockSelector({
  total: 15,
  size: 15,
})

const orgDefaultWaitingsMetaSelector = mockSelector({
  total: 20,
  size: 20,
})

export {
  orgUserManagementPageInviteesSelector,
  orgUserManagementPageSelector,
  orgUserManagementPageWaitingForApprovalSelector,
  orgDefaultInviteesMetaSelector,
  orgDefaultWaitingsMetaSelector,
}
