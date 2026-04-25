
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { customizationSelector } from '@/selectors/customization'
import { openInNewTarget } from '@/utils/window'
import { StartTourButton } from './StartTourButton'

let mockCallbackFn

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/customization')
jest.mock('@/selectors/authorization')

jest.mock('@/utils/window', () => ({
  openInNewTarget: jest.fn((event, url, cb) => {
    mockCallbackFn = cb
    cb()
  }),
}))

describe('Component: StartTourButton', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<StartTourButton />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render StartTourButton component correctly', () => {
    const ChildrenComponent = wrapper.find(ModuleLoader).props().children('MockComponent')
    const StartTourButton = shallow(<div>{ChildrenComponent}</div>)
    expect(StartTourButton).toMatchSnapshot()
  })

  it('should not render StartTourButton component in case there is no component in customization', () => {
    customizationSelector.mockImplementationOnce(() => ({}))
    wrapper = shallow(<StartTourButton />)
    const Button = wrapper.find(ModuleLoader)?.children()

    expect(Button.exists()).toBe(false)
  })

  it('should call openInNewTarget if onClick prop is called', () => {
    const StartTourButton = wrapper.find(ModuleLoader).props().children('mock')

    const mockPath = 'mockPath'
    const mockEvent = {
      target: 'mockTarget',
    }

    StartTourButton.props.onClick(mockEvent, mockPath)

    expect(openInNewTarget).nthCalledWith(1, mockEvent, mockPath, mockCallbackFn)
  })
})
