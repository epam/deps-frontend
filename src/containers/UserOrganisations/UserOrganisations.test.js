
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { Menu } from '@/components/Menu'
import { localize, Localization } from '@/localization/i18n'
import { Organisation } from '@/models/Organisation'
import { organisationsSelector } from '@/selectors/organisations'
import { UserOrganisations } from '.'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/organisations')
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/api/iamApi', () => ({
  iamApi: {
    activateUserOrganisation: jest.fn(),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

const { ConnectedComponent, mapStateToProps } = UserOrganisations

describe('Component: UserOrganisations', () => {
  describe('mapStateToProps', () => {
    it('should call organisationsSelector with state and pass the result as user prop', () => {
      const { props } = mapStateToProps()
      expect(organisationsSelector).toHaveBeenCalled()
      expect(props.organisations).toEqual(organisationsSelector.getSelectorMockValue())
    })
  })

  describe('Component: ', () => {
    let wrapper, defaultProps

    beforeEach(() => {
      defaultProps = {
        organisations: [
          new Organisation('1111', 'TestOrganisation'),
          new Organisation('1112', 'TestOrganisation2'),
          new Organisation('1113', 'TestOrganisation3'),
        ],
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render the correct layout with many organisations', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render the correct layout with one organisation', () => {
      defaultProps.organisations = [
        new Organisation('1111', 'TestOrganisation'),
      ]

      wrapper.setProps(defaultProps)

      expect(wrapper).toMatchSnapshot()
    })

    it('should call notifySuccess and reload the window in case of clicking on menu item', async () => {
      delete window.location
      window.location = {
        reload: jest.fn(),
      }
      const MenuItem = wrapper.find(Menu.Item).at(0).props()
      await MenuItem.onClick()
      expect(mockNotification.notifySuccess).nthCalledWith(1, localize(Localization.ACTIVE_ORGANISATION_SUCCESS))
      expect(window.location.reload).toHaveBeenCalled()
    })
  })
})
