import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRouter } from '@/mocks/mockReactRouter'
import { shallow } from 'enzyme'
import { Spin } from '@/components/Spin'
import { useCustomModule } from '@/hooks/useCustomModule'
import { ApplicationRootRoutes } from './ApplicationRootRoutes'

const mockedModule = [{
  Component: mockComponent('CustomizationPage'),
  path: 'mockPath',
}]

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-router', () => mockReactRouter)
jest.mock('@/hooks/useCustomModule', () => ({
  useCustomModule: jest.fn(() => ({
    module: mockedModule,
    ready: true,
    loaded: true,
  })),
}))

jest.mock('@/application/ApplicationLayout', () => mockComponent('ApplicationLayout'))

describe('Component: ApplicationRootRoutes', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ApplicationRootRoutes />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render spinner if ready is false', () => {
    useCustomModule.mockImplementationOnce(() => ({
      module: mockedModule,
      ready: false,
    }))

    wrapper = shallow(<ApplicationRootRoutes />)

    expect(wrapper.find(Spin.Centered).exists()).toBe(true)
  })

  it('should render correct layout without custom routes', () => {
    useCustomModule.mockImplementationOnce(() => ({
      ready: true,
    }))

    wrapper = shallow(<ApplicationRootRoutes />)

    expect(wrapper).toMatchSnapshot()
  })
})
