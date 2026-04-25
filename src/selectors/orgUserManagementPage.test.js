
import {
  orgUserManagementPageInviteesSelector,
  orgUserManagementPageSelector,
  orgUserManagementPageWaitingForApprovalSelector,
} from '@/selectors/orgUserManagementPage'

describe('Selectors: orgUserManagementPage', () => {
  let state

  beforeEach(() => {
    state = {
      orgUserManagementPage: {
        inviteesTab: {
          total: 5,
          size: 10,
        },
        waitingForApprovalTab: {
          total: 5,
          size: 10,
        },
      },
    }
  })

  it('selector: orgUserManagementPageSelector', () => {
    expect(orgUserManagementPageSelector(state)).toEqual(state.orgUserManagementPage)
  })

  it('selector: orgUserManagementPageInviteesSelector', () => {
    expect(orgUserManagementPageInviteesSelector(state)).toEqual(state.orgUserManagementPage.inviteesTab)
  })

  it('selector: orgUserManagementPageWaitingForApprovalSelector', () => {
    expect(orgUserManagementPageWaitingForApprovalSelector(state))
      .toEqual(state.orgUserManagementPage.waitingForApprovalTab)
  })
})
