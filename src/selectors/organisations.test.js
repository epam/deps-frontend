
import { Organisation } from '@/models/Organisation'
import { organisationsSelector } from '@/selectors/organisations'

describe('Selectors: organisations', () => {
  let state

  beforeEach(() => {
    state = {
      organisations: [
        new Organisation('1111', 'TestOrganisation'),
        new Organisation('1234', 'TestOrganisations2'),
      ],
    }
  })

  it('selector: organisationsSelector', () => {
    expect(organisationsSelector(state)).toEqual(state.organisations)
  })
})
