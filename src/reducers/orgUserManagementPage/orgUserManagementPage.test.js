
import { mockEnv } from '@/mocks/mockEnv'
import {
  storeDefaultInviteesMeta,
  storeDefaultWaitingsMeta,
  storeInviteesMeta,
  storeWaitingForApprovalUsersMeta,
} from '@/actions/orgUserManagementPage'
import { orgUserManagementPageReducer } from '@/reducers/orgUserManagementPage'

jest.mock('@/utils/env', () => mockEnv)

const mockInviteesMeta = {
  inviteesTab: {
    total: 2,
    size: 2,
  },
}

const mockWaitingForApprovalTab = {
  waitingForApprovalTab: {
    total: 2,
    size: 2,
  },
}

const mockInviteesDefaultMetaTab = {
  inviteesDefaultMeta: {
    total: 2,
    size: 2,
  },
}

const mockWaitingsDefaultTab = {
  waitingsDefaultMeta: {
    total: 2,
    size: 2,
  },
}

describe('Reducer: orgUserManagementPage', () => {
  let state

  beforeAll(() => {
    state = []
  })

  it('should add inviteesMeta to the state', () => {
    const action = storeInviteesMeta(mockInviteesMeta.inviteesTab)
    expect(orgUserManagementPageReducer(state, action)).toEqual(mockInviteesMeta)
  })

  it('should add waitingForApprovalUsersMeta to the state', () => {
    const action = storeWaitingForApprovalUsersMeta(mockWaitingForApprovalTab.waitingForApprovalTab)
    expect(orgUserManagementPageReducer(state, action)).toEqual(mockWaitingForApprovalTab)
  })

  it('should add inviteesDefaultMeta to the state', () => {
    const action = storeDefaultInviteesMeta(mockInviteesDefaultMetaTab.inviteesDefaultMeta)
    expect(orgUserManagementPageReducer(state, action)).toEqual(mockInviteesDefaultMetaTab)
  })

  it('should add waitingsDefaultMeta to the state', () => {
    const action = storeDefaultWaitingsMeta(mockWaitingsDefaultTab.waitingsDefaultMeta)
    expect(orgUserManagementPageReducer(state, action)).toEqual(mockWaitingsDefaultTab)
  })
})
