
import { mockEnv } from '@/mocks/mockEnv'
import { storeOrganisations } from '@/actions/organisations'
import { Organisation } from '@/models/Organisation'
import { organisationsReducer } from '@/reducers/organisations'

jest.mock('@/utils/env', () => mockEnv)

const mockOrganisations = [new Organisation('1111', 'TestOrganisation')]

describe('Reducer: Organisations', () => {
  let state

  beforeAll(() => {
    state = []
  })

  it('should add organisations to the state', () => {
    const action = storeOrganisations(mockOrganisations)

    expect(organisationsReducer(state, action)).toEqual(mockOrganisations)
  })

  it('should override previous organisations', () => {
    state = [
      new Organisation('1234', 'TestOrg'),
      new Organisation('4567', 'TestOrg'),
    ]
    const action = storeOrganisations(mockOrganisations)

    expect(organisationsReducer(state, action)).toEqual(mockOrganisations)
  })
})
