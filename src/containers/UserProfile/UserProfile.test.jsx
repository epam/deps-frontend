
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { authenticationProvider } from '@/authentication'
import { UI_ENV_SETTINGS_QUERY_KEY } from '@/constants/navigation'
import { localize, Localization } from '@/localization/i18n'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { notifySuccess } from '@/utils/notification'
import { StyledMenu, ProfileMenuOption } from './UserProfile.styles'
import { UserProfile } from './'

const mockUser = new User(
  'email@email.com',
  'Mick',
  'Duo',
  new Organisation('1111', 'TestOrganisation', null),
  'mickDuo',
  '123',
  '10.11.22',
  null,
)
const mockAccessToken = 'access_token'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/containers/UserOrganisations', () => mockComponent('UserOrganisations'))
jest.mock('@/selectors/authorization')
jest.mock('@/selectors/customization')
jest.mock('@/authentication', () => ({
  authenticationProvider: {
    getUser: jest.fn(() => mockUser),
    getAccessToken: jest.fn(() => mockAccessToken),
  },
}))

const mockSetQueryParams = jest.fn()

jest.mock('@/hooks/useQueryParams', () => ({
  useQueryParams: jest.fn(() => ({
    setQueryParams: mockSetQueryParams,
  })),
}))

jest.mock('@/utils/features', () => ({
  isFeatureEnabled: jest.fn(() => true),
}))

jest.mock('@/utils/notification', () => ({
  notifySuccess: jest.fn(),
}))

jest.mock('@/containers/ChangeOrgNameFormButton', () => mockComponent('ChangeOrgNameFormButton'))

jest.mock('@/utils/env', () => mockEnv)

const getOptionClick = async (component, name) => {
  const menuProps = component.find(StyledMenu).props()
  const menuOption = shallow(
    <div>
      {
        menuProps.items.find((item) => item.content().props.children === name).content()
      }
    </div>,
  )
  const option = menuOption.find(ProfileMenuOption)
  await option.props().onClick()
}

const { ConnectedComponent, mapStateToProps } = UserProfile

describe('Component: UserProfile', () => {
  describe('mapStateToProps', () => {
    it('should call userSelector with state and pass the result as user prop', () => {
      const { props } = mapStateToProps()
      expect(userSelector).toHaveBeenCalled()
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })

    it('should call customizationSelector with state and pass the result as user prop', () => {
      const { props } = mapStateToProps()
      expect(customizationSelector).toHaveBeenCalled()
      expect(props.customization).toEqual(customizationSelector.getSelectorMockValue())
    })
  })

  let component, defaultProps

  beforeEach(() => {
    defaultProps = {
      user: mockUser,
      customization: {},
    }

    navigator.clipboard = {
      writeText: jest.fn(() => Promise.resolve()),
    }
    component = shallow(<ConnectedComponent {...defaultProps} />)
  })

  it('should render the correct layout based on the props', () => {
    expect(component).toMatchSnapshot()
  })

  it('should render correct items', () => {
    const menuItemsProp = component.props().items
    menuItemsProp.forEach((item) => {
      expect(shallow(<div>{item.content()}</div>)).toMatchSnapshot()
    })
  })

  it('should call authenticationProvider.getAccessToken in case of calling on click of the get Api key option', async () => {
    await getOptionClick(component, localize(Localization.GET_API_KEY))
    expect(authenticationProvider.getAccessToken).toHaveBeenCalledTimes(1)
    expect(authenticationProvider.getAccessToken()).toEqual(mockAccessToken)
  })

  it('should call navigator.clipboard.writeText in case of calling on click of the get Api key option', async () => {
    await getOptionClick(component, localize(Localization.GET_API_KEY))
    const token = authenticationProvider.getAccessToken()
    expect(navigator.clipboard.writeText).nthCalledWith(1, token)
  })

  it('should call notifySuccess once with correct value in case of calling on click of the get Api key option', async () => {
    await getOptionClick(component, localize(Localization.GET_API_KEY))
    expect(notifySuccess).nthCalledWith(1, 'API key has been copied into clipboard')
  })

  it('should call setQueryParams once with correct value in case of calling on click of the Interface Settings option', async () => {
    await getOptionClick(component, localize(Localization.INTERFACE_SETTINGS))
    expect(mockSetQueryParams).toHaveBeenCalledWith({ [UI_ENV_SETTINGS_QUERY_KEY]: 1 })
  })
})
