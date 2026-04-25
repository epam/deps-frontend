
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { updateConfidenceView } from '@/actions/documentReviewPage'
import { Button } from '@/components/Button'
import { Dropdown } from '@/components/Dropdown'
import { Switch } from '@/components/Switch'
import { ConfidenceLevel } from '@/enums/ConfidenceLevel'
import { Localization, localize } from '@/localization/i18n'
import { ConfidenceLevelDropdown } from './ConfidenceLevelDropdown'
import { ConfidenceLevelRangeHint } from './ConfidenceLevelRangeHint'
import { EnableAllDropdownItem } from './EnableAllDropdownItem'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/actions/documentReviewPage', () => ({
  updateConfidenceView: jest.fn(),
}))

const { mapDispatchToProps, ConnectedComponent } = ConfidenceLevelDropdown

const confidenceView = {
  [ConfidenceLevel.LOW]: true,
  [ConfidenceLevel.MEDIUM]: true,
  [ConfidenceLevel.HIGH]: true,
}

describe('Container: ConfidenceLevelDropdown', () => {
  describe('component', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        onConfidenceAllSwitchChange: jest.fn(),
        updateConfidenceView: jest.fn(),
        confidenceView,
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should call updateConfidenceView prop on Confidence Level switch change', () => {
      const dropdownProps = wrapper.find(Dropdown).props()
      const dropdownMenu = shallow(<div>{dropdownProps.dropdownRender()}</div>)
      dropdownMenu.find(Switch).at(0).props().onChange(true)

      expect(defaultProps.updateConfidenceView).nthCalledWith(1, {
        [ConfidenceLevel.HIGH]: true,
      })
    })

    it('should call updateConfidenceView prop on Enable All switch change', () => {
      const dropdownProps = wrapper.find(Dropdown).props()
      const dropdownMenu = shallow(<div>{dropdownProps.dropdownRender()}</div>)
      dropdownMenu.find(EnableAllDropdownItem).props().onChange(true)

      expect(defaultProps.updateConfidenceView).nthCalledWith(1, {
        [ConfidenceLevel.HIGH]: true,
        [ConfidenceLevel.LOW]: true,
        [ConfidenceLevel.MEDIUM]: true,
        [ConfidenceLevel.NOT_APPLICABLE]: true,
      })
    })

    it('should disable trigger button if props disabled is true', () => {
      wrapper.setProps({
        ...defaultProps,
        disabled: true,
      })

      expect(wrapper.find(Button.Secondary).props().disabled).toBeTruthy()
    })

    it('should render confidence level menu content with correct switches and labels', () => {
      const dropdownProps = wrapper.find(Dropdown).props()
      const dropdownMenu = shallow(<div>{dropdownProps.dropdownRender()}</div>)
      const rangeHints = dropdownMenu.find(ConfidenceLevelRangeHint)
      const switches = dropdownMenu.find(Switch)

      Object.values(ConfidenceLevel).forEach((level, index) => {
        expect(rangeHints.at(index).props().confidenceLevel).toEqual(level)
        expect(switches.at(index).props().checked).toEqual(confidenceView[level])
      })

      expect(dropdownMenu.text()).toContain(localize(Localization.CONFIDENCE_LEVEL_INFO))
      expect(dropdownMenu.find(EnableAllDropdownItem).exists()).toBe(true)
    })
  })

  describe('mapDispatchToProps', () => {
    let props
    beforeEach(() => {
      props = mapDispatchToProps().props
    })

    it('should pass updateConfidenceView action as updateConfidenceView property', () => {
      props.updateConfidenceView()
      expect(updateConfidenceView).toHaveBeenCalledTimes(1)
    })
  })
})
