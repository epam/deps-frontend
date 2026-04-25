
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { useCustomModule } from '@/hooks/useCustomModule'
import { withShouldHideEmptyEdFields } from './withShouldHideEmptyEdFields'

const mockedModule = 'mockedModule'

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/hooks/useCustomModule', () => ({
  useCustomModule: jest.fn(() => ({
    module: mockedModule,
  })),
}))

jest.mock('@/selectors/authorization')
jest.mock('@/selectors/customization')
jest.mock('@/utils/env', () => mockEnv)

const MockComponent = () => <div />

describe('HOC: withShouldHideEmptyEdFields', () => {
  let wrapper

  beforeEach(() => {
    const Component = withShouldHideEmptyEdFields(MockComponent)

    wrapper = shallow(<Component />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call useCustomModule', () => {
    expect(useCustomModule).toHaveBeenCalled()
  })
})
