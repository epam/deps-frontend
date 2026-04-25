
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { localize, Localization } from '@/localization/i18n'
import { customizationSelector } from '@/selectors/customization'
import { notifyWarning } from '@/utils/notification'
import { UserGuideDownloadButton } from './UserGuideDownloadButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/selectors/customization')
jest.mock('@/selectors/authorization')

describe('Component: UserGuideDownloadButton', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<UserGuideDownloadButton />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render UserGuideDownloadButton component correctly', () => {
    const ChildrenComponent = wrapper.find(ModuleLoader).props().children('MockComponent')
    const UserGuideDownloadButton = shallow(<div>{ChildrenComponent}</div>)
    expect(UserGuideDownloadButton).toMatchSnapshot()
  })

  it('should not render UserGuideDownloadButton component in case there is no component in customization', () => {
    customizationSelector.mockImplementationOnce(() => ({}))
    wrapper = shallow(<UserGuideDownloadButton />)
    const Guide = wrapper.find(ModuleLoader)?.children()
    expect(Guide.exists()).toBe(false)
  })

  it('should call notifyWarning if showErrorMessage prop is called in UserGuideDownloadButton', () => {
    const UserGuideDownloadButton = wrapper.find(ModuleLoader).props().children('mock')
    UserGuideDownloadButton.props.showErrorMessage()
    expect(notifyWarning).nthCalledWith(1, localize(Localization.DOWNLOAD_FAILURE))
  })
})
