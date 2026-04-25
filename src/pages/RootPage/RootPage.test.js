
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { RootPage } from './'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: RootPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<RootPage />)
  })

  it('should render component correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
