
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { DashboardPage } from './'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/DashboardCharts', () => mockComponent('DashboardCharts'))

describe('Page: DashboardPage', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<DashboardPage />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
