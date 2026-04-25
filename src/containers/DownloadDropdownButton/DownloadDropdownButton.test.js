
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { localize, Localization } from '@/localization/i18n'
import { customizationSelector } from '@/selectors/customization'
import { notifyWarning } from '@/utils/notification'
import { DownloadDropdownButton } from './DownloadDropdownButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/selectors/customization')
jest.mock('@/selectors/authorization')

describe('Container: DownloadDropdownButton', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      documentId: '123',
      documentTypeCode: 'test',
      documentName: 'Title',
    }

    wrapper = shallow(<DownloadDropdownButton {...defaultProps} />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render DownloadDropdownButton component correctly', () => {
    const ChildrenComponent = wrapper.find(ModuleLoader).props().children('MockComponent')
    const DownloadDropdownButton = shallow(<div>{ChildrenComponent}</div>)
    expect(DownloadDropdownButton).toMatchSnapshot()
  })

  it('should not render DownloadDropdownButton component in case there is no component in customization', () => {
    customizationSelector.mockImplementationOnce(() => ({}))
    wrapper = shallow(<DownloadDropdownButton {...defaultProps} />)
    const DownloadButton = wrapper.find(ModuleLoader)?.children()
    expect(DownloadButton.exists()).toBe(false)
  })

  it('should call notifyWarning if showErrorMessage prop is called in DownloadDropdownButton', () => {
    const DownloadDropdownButton = wrapper.find(ModuleLoader).props().children('mock')
    DownloadDropdownButton.props.showErrorMessage()
    expect(notifyWarning).nthCalledWith(1, localize(Localization.DOWNLOAD_FAILURE))
  })

  it('should render correct layout for local error boundary', () => {
    const error = wrapper.find(ErrorBoundary).first().props().localBoundary()
    expect(error).toMatchSnapshot()
  })
})
