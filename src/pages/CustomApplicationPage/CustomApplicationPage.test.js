
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { userSelector } from '@/selectors/authorization'
import { CustomApplicationPage } from './CustomApplicationPage'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/authorization')
jest.mock('@/containers/ApplicationLogo', () => mockComponent('ApplicationLogo'))
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    createMultiUploadSession: jest.fn(),
    createDocumentLegacy: jest.fn(),
    runPipeline: jest.fn(),
  },
}))

const MockComponent = () => <div />

describe('Page: CustomApplicationPage', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      renderChild: jest.fn((props) => <MockComponent {...props} />),
    }

    wrapper = shallow(<CustomApplicationPage {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should pass correct props to child component', () => {
    const props = wrapper.find(MockComponent).props()

    const expectedProps = {
      user: userSelector.getSelectorMockValue(),
      renderApplicationLogo: expect.any(Function),
      onLogOut: expect.any(Function),
      notifications: {
        error: mockNotification.notifyError,
        warning: mockNotification.notifyWarning,
        success: mockNotification.notifySuccess,
        progress: mockNotification.notifyProgress,
      },
      api: {
        createSession: expect.any(Function),
        runPipeline: expect.any(Function),
        uploadDocument: expect.any(Function),
      },
      goTo: {
        documentsPage: expect.any(Function),
      },
    }

    expect(props).toEqual(expectedProps)
  })
})
