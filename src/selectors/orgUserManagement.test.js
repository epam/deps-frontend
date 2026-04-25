
import {
  orgUserManagementInviteesSelector,
  orgUserManagementSelector,
  orgUserManagementWaitingForApprovalSelector,
} from '@/selectors/orgUserManagement'

describe('Selectors: orgUserManagement', () => {
  let state

  beforeEach(() => {
    state = {
      orgUserManagement: {
        invitees: [
          {
            email: 'test@test.ru',
          },
          {
            email: 'test2@test.ru',
          },
        ],
      },
    }
  })

  it('selector: orgUserManagementSelector', () => {
    expect(orgUserManagementSelector(state)).toEqual(state.orgUserManagement)
  })

  it('selector: orgUserManagementInviteesSelector', () => {
    expect(orgUserManagementInviteesSelector(state)).toEqual(state.orgUserManagement.invitees)
  })

  it('selector: orgUserManagementWaitingForApprovalSelector', () => {
    expect(orgUserManagementWaitingForApprovalSelector(state)).toEqual(state.orgUserManagement.waitingForApproval)
  })
})
