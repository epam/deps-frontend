
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { withCustomization } from './withCustomization'

const mockCallback = jest.fn()

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/hooks/useCustomization', () => ({
  useCustomization: jest.fn(() => ({
    module: mockCallback,
  })),
}))

jest.mock('@/selectors/authorization')
jest.mock('@/selectors/customization')
jest.mock('@/utils/env', () => mockEnv)

const MockComponent = () => <div />

describe('HOC: withCustomization', () => {
  let wrapper

  beforeEach(() => {
    const Component = withCustomization(MockComponent)

    wrapper = shallow(<Component />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call module callback when call getApiUrl', () => {
    wrapper.find(MockComponent).props().getApiUrl()

    expect(mockCallback).toHaveBeenCalled()
  })
})
