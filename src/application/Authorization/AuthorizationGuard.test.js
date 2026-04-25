
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { useLocation } from 'react-router-dom'
import { fetchMe } from '@/actions/authorization'
import { fetchOrganisations } from '@/actions/organisations'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { navigationMap } from '@/utils/navigationMap'
import { AuthorizationGuard } from './AuthorizationGuard'

const mockUser = new User(
  'system@email.com',
  'Test',
  'Tester',
  new Organisation(
    '1111',
    'TestOrganisation',
    'http://host/customization.js',
  ),
  'SystemUser',
)

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(() => ({
    pathname: 'mockPath',
  })),
}))
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/authorization')
jest.mock('@/actions/authorization', () => ({
  fetchMe: jest.fn(() => Promise.resolve(mockUser)),
}))
jest.mock('@/actions/organisations', () => ({
  fetchOrganisations: jest.fn(() => Promise.resolve()),
}))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn((f) => f()),
}))
jest.mock('@/utils/env', () => mockEnv)

const {
  ConnectedComponent,
  mapStateToProps,
  mapDispatchToProps,
} = AuthorizationGuard

describe('Component: AuthorizationGuard', () => {
  describe('mapStateToProps', () => {
    it('should call userSelector with state and pass the result as user prop', () => {
      const { props } = mapStateToProps()
      expect(userSelector).toHaveBeenCalled()
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })
  })

  describe('mapDispatchToProps', () => {
    it('should call to fetchMe action when calling to fetchMe prop', () => {
      const { props } = mapDispatchToProps()

      props.fetchMe()
      expect(fetchMe).toHaveBeenCalledTimes(1)
    })

    it('should call to fetchOrganisations action when calling to fetchOrganisations prop', () => {
      const { props } = mapDispatchToProps()

      props.fetchOrganisations()
      expect(fetchOrganisations).toHaveBeenCalledTimes(1)
    })
  })

  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      user: new User(
        'test@test.com',
        'Test',
        'Test',
        new Organisation('deps-test', 'TestOrganisation'),
        'test',
        'test',
      ),
      fetchMe: jest.fn(() => Promise.resolve(mockUser)),
      fetchOrganisations: jest.fn(() => Promise.resolve()),
      children: <div />,
    }

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
  })

  it('should render component correctly in case user was authorized', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render component correctly in case user is not defined', () => {
    defaultProps.user = null

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render Redirect component with correct props in case user іs not assigned to any organisation', () => {
    defaultProps.user = new User(
      'email',
      'firstName',
      'lastname',
      null,
      'test',
      'test',
    )

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)

    expect(wrapper.props().to).toEqual(navigationMap.error.noUserOrganisation())
  })

  it('should render correct layout in case user іs not assigned to any organisation but in process of joining organisation', () => {
    defaultProps.user = new User(
      'email',
      'firstName',
      'lastname',
      null,
      'test',
      'test',
    )

    useLocation.mockImplementationOnce(jest.fn(() => ({
      pathname: navigationMap.join(),
    })))

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should call fetchMe and fetchOrganisations if user is not defined', async () => {
    jest.clearAllMocks()

    defaultProps.user = null
    await shallow(<ConnectedComponent {...defaultProps} />)

    expect(defaultProps.fetchMe).toHaveBeenCalled()
    expect(defaultProps.fetchOrganisations).toHaveBeenCalled()
  })

  it('should not call fetchMe and fetchOrganisations if user is defined', () => {
    jest.clearAllMocks()

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)

    expect(defaultProps.fetchMe).not.toHaveBeenCalled()
    expect(defaultProps.fetchOrganisations).not.toHaveBeenCalled()
  })
})
