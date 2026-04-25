
import { mockEnv } from '@/mocks/mockEnv'
import {
  storeUser,
} from '@/actions/authorization'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import { authorizationReducer } from '@/reducers/authorization'

jest.mock('@/utils/env', () => mockEnv)

describe('Reducer: Authorization', () => {
  let state

  beforeAll(() => {
    state = {
      user: null,
      organisationUsers: null,
    }
  })

  it('should correctly handle storeUser action', () => {
    const mockUser = new User(
      'system@email.com',
      'Test',
      'Tester',
      new Organisation(
        '1111',
        'TestOrganisation',
        'http://host/customization.js',
      ),
      'SystemUser',
    )
    const action = storeUser(mockUser)

    expect(authorizationReducer(state, action).user).toEqual(action.payload)
  })
})
