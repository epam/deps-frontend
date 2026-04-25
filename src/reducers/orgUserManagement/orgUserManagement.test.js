
import { mockEnv } from '@/mocks/mockEnv'
import {
  storeInvitees,
  storeWaitingForApprovalUsers,
} from '@/actions/orgUserManagement'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import { orgUserManagementReducer } from '@/reducers/orgUserManagement'

jest.mock('@/utils/env', () => mockEnv)

const mockInvitees = {
  invitees: [
    {
      email: 'test1@test.com',
    },
    {
      email: 'test2@test.com',
    },
  ],
}

const mockUsers = {
  users: [
    new User(
      'test@test.com',
      'John',
      'Doe',
      new Organisation('1', 'org1'),
      'user',
      '222',
      '20.08.2022',
      'mockUrl',
    ),
    new User(
      'test1@test.com',
      'John',
      'Doe',
      new Organisation('1', 'org1'),
      'user',
      '222',
      '20.08.2022',
      'mockUrl1',
    ),
  ],
}

const mockWaitingForApproval = {
  waitingForApproval: mockUsers.users,
}

describe('Reducer: orgUserManagement', () => {
  let state

  beforeAll(() => {
    state = []
  })

  it('should add invitees to the state', () => {
    const action = storeInvitees(mockInvitees.invitees)
    expect(orgUserManagementReducer(state, action)).toEqual(mockInvitees)
  })

  it('should add waiting for approve users to the state', () => {
    const action = storeWaitingForApprovalUsers(mockUsers.users)
    expect(orgUserManagementReducer(state, action)).toEqual(mockWaitingForApproval)
  })
})
