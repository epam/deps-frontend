
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { ServicesVersionsPage } from './ServicesVersionsPage'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ServicesVersionsPage', () => {
  let wrapper

  it('should render component correctly', () => {
    wrapper = shallow(<ServicesVersionsPage />)
    expect(wrapper).toMatchSnapshot()
  })
})
