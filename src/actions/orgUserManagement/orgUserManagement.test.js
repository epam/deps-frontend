
import { mockEnv } from '@/mocks/mockEnv'
import {
  fetchInvitedUsersByFilter,
  storeInvitees,
  fetchWaitingForApprovalUsersByFilter,
  storeWaitingForApprovalUsers,
} from '@/actions/orgUserManagement'
import {
  storeInviteesMeta,
  storeWaitingForApprovalUsersMeta,
} from '@/actions/orgUserManagementPage'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'

jest.mock('@/api/iamApi', () => ({
  iamApi: {
    invitedUsers: jest.fn(() => Promise.resolve(mockInvitees)),
    waitingForApproval: jest.fn(() => Promise.resolve(mockUsers)),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

const mockInvitees = {
  meta: {
    total: 2,
    size: 2,
  },
  result: [
    {
      email: 'test@test.com',
    },
  ],
}
const mockUsers = {
  meta: {
    total: 2,
    size: 2,
  },
  result: [
    new User(
      'test@test.com',
      'John',
      'Doe',
      new Organisation('1', 'org'),
      'user',
      '1',
    ),
  ],
}

describe('Action creator: fetchInvitedUsersByFilter', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call dispatch with storeOrganisations action', async () => {
    await fetchInvitedUsersByFilter()(dispatch)
    expect(dispatch).nthCalledWith(2, storeInvitees(mockInvitees.result))
    expect(dispatch).nthCalledWith(3, storeInviteesMeta(mockInvitees.meta))
  })
})

describe('Action creator: fetchWaitingForApprovalUsersByFilter', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call dispatch with fetchWaitingForApprovalUsersByFilter action', async () => {
    await fetchWaitingForApprovalUsersByFilter()(dispatch)
    expect(dispatch).nthCalledWith(2, storeWaitingForApprovalUsers(mockUsers.result))
    expect(dispatch).nthCalledWith(3, storeWaitingForApprovalUsersMeta(mockUsers.meta))
  })
})
