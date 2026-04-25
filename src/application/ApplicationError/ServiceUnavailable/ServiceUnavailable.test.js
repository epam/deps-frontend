
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { ServiceUnavailable } from '.'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ServiceUnavailable', () => {
  let component

  beforeEach(() => {
    component = shallow(<ServiceUnavailable />)
  })

  it('should render the correct layout', () => {
    expect(component).toMatchSnapshot()
  })
})
