
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { changeFieldsGrouping } from '@/actions/documentReviewPage'
import { Dropdown } from '@/components/Dropdown'
import { Menu } from '@/components/Menu'
import { GROUPING_TYPE } from '@/enums/GroupingTypeTabs'
import { Localization, localize } from '@/localization/i18n'
import { ViewSwitcher } from './ViewSwitcher'
import { MenuItem as StyledMenuItem } from './ViewSwitcher.styles'

jest.mock('react-redux', () => mockReactRedux)

jest.mock('@/actions/documentReviewPage', () => ({
  changeFieldsGrouping: jest.fn(),
}))

jest.mock('@/utils/env', () => mockEnv)

const { mapDispatchToProps, ConnectedComponent } = ViewSwitcher

describe('ViewSwitcher', () => {
  describe('component', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        changeActiveTab: jest.fn(),
        changeFieldsGrouping: jest.fn(),
        fieldsGrouping: GROUPING_TYPE.USER_DEFINED,
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should call props.changeFieldsGrouping and props.changeActiveTab in case calling to Menu.props.onClick', () => {
      const dropdownProps = wrapper.find(Dropdown).props()
      const tempWrap = shallow(<div>{dropdownProps.dropdownRender()}</div>)
      const menuProps = tempWrap.find(Menu).props()
      const mockItem = { key: 'test' }
      menuProps.onClick(mockItem)
      expect(defaultProps.changeFieldsGrouping).nthCalledWith(1, mockItem.key)
      expect(defaultProps.changeActiveTab).nthCalledWith(1, null)
    })

    it('should render menu with correct content', () => {
      const dropdownProps = wrapper.find(Dropdown).props()
      const menuWrapper = shallow(<div>{dropdownProps.dropdownRender()}</div>)
      const menuItems = menuWrapper.find(StyledMenuItem)

      expect(menuItems).toHaveLength(Object.values(GROUPING_TYPE).length)

      Object.entries({
        [GROUPING_TYPE.BY_PAGE]: localize(Localization.VIEW_PAGES),
        [GROUPING_TYPE.USER_DEFINED]: localize(Localization.VIEW_GROUP),
        [GROUPING_TYPE.SET_INDEX]: localize(Localization.VIEW_SETS),
      }).forEach(([key, label], index) => {
        expect(menuItems.at(index).props().id).toEqual(key)
        expect(menuItems.at(index).props().$selected).toEqual(defaultProps.fieldsGrouping === key)
        expect(menuItems.at(index).text()).toEqual(label)
      })
    })
  })

  describe('mapDispatchToProps', () => {
    let props
    beforeEach(() => {
      props = mapDispatchToProps().props
    })

    it('should pass v action as changeFieldsGrouping property', () => {
      props.changeFieldsGrouping()
      expect(changeFieldsGrouping).toHaveBeenCalledTimes(1)
    })
  })
})
