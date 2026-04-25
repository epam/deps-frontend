
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import {
  userSelector,
} from './authorization'

describe('Selectors: authorization', () => {
  let state
  beforeEach(() => {
    state = {
      authorization: {
        user: new User(
          'system@email.com',
          'Test',
          'Tester',
          new Organisation(
            'test',
            'Test',
            'url-custom',
          ),
          'SystemUser',
        ),
        organisations: [new Organisation('1111', 'TestOrganisation')],
      },
    }
  })

  it('selector: userSelector', () => {
    const { user: expectedUser } = state.authorization

    expect(userSelector(state)).toEqual(expectedUser)
  })
})
