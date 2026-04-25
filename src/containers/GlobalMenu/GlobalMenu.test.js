
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { GlobalMenu } from './GlobalMenu'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/customization')
jest.mock('@/selectors/authorization')
jest.mock('@/utils/env', () => mockEnv)

describe('Container: GlobalMenu', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<GlobalMenu />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render GlobalMenu container in case there is no component in customization', () => {
    customizationSelector.mockImplementationOnce(() => ({}))
    wrapper = shallow(<GlobalMenu />)
    const Menu = wrapper.find(ModuleLoader)?.children()
    expect(Menu.exists()).toBe(false)
  })

  it('should load GlobalMenu container via correct URL in case there is no customizationUrl in user organisation', () => {
    const mockUser = {
      organisation: {},
      defaultCustomizationUrl: 'mockDefaultUrl',
    }
    customizationSelector.mockImplementationOnce(() => ({
      GlobalMenu: {
        getUrl: jest.fn((url) => url),
      },
    }))
    userSelector.mockImplementationOnce(() => mockUser)
    wrapper = shallow(<GlobalMenu />)
    const ModuleLoaderUrl = wrapper.find(ModuleLoader).props().url
    expect(ModuleLoaderUrl).toBe(mockUser.defaultCustomizationUrl)
  })
})
