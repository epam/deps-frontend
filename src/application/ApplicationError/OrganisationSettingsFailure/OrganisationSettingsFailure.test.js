
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { OrganisationSettingsFailure } from '.'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: OrganisationSettingsFailure', () => {
  let component

  beforeEach(() => {
    component = shallow(<OrganisationSettingsFailure />)
  })

  it('should render the correct layout', () => {
    expect(component).toMatchSnapshot()
  })
})
