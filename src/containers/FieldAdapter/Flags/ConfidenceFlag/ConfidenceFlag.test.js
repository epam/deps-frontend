
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { Flag } from '@/components/Flag'
import { FlagType } from '@/components/Flag/FlagType'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { confidenceViewSelector } from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'
import { ConfidenceFlag } from './ConfidenceFlag'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage', () => ({
  confidenceViewSelector: jest.fn(() => ({
    low: true,
    medium: true,
    high: true,
    notApplicable: true,
  })),
}))

const {
  mapStateToProps,
  ConnectedComponent,
} = ConfidenceFlag

describe('Container: ConfidenceFlag', () => {
  describe('mapStateToProps', () => {
    it('should call confidenceViewSelector and pass the result as confidenceView prop', () => {
      const { props } = mapStateToProps()

      expect(confidenceViewSelector).toHaveBeenCalledTimes(1)
      expect(props.confidenceView).toEqual(confidenceViewSelector())
    })
  })

  describe('ConnectedComponent', () => {
    let wrapper, defaultProps, expectedResult

    beforeEach(() => {
      jest.clearAllMocks()
      defaultProps = {
        confidence: 80,
        confidenceView: confidenceViewSelector(),
      }
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render ConfidenceFlag with correct properties in case there is low confidence level is 80', () => {
      expectedResult = {
        onClick: undefined,
        symbol: defaultProps.confidence,
        title: localize(Localization.LOW_CONFIDENCE_LEVEL, { confidence: defaultProps.confidence }),
        tooltipPlacement: Placement.TOP,
        type: FlagType.ERROR,
      }
      expect(wrapper.find(Flag).props()).toEqual(expectedResult)
    })

    it('should render ConfidenceFlag with correct properties in case there is medium confidence level is 81', () => {
      defaultProps.confidence = 81
      wrapper.setProps(defaultProps)
      expectedResult = {
        onClick: undefined,
        symbol: defaultProps.confidence,
        title: localize(Localization.MEDIUM_CONFIDENCE_LEVEL, { confidence: defaultProps.confidence }),
        tooltipPlacement: Placement.TOP,
        type: FlagType.WARNING,
      }
      expect(wrapper.find(Flag).props()).toEqual(expectedResult)
    })

    it('should render ConfidenceFlag with correct properties in case there is high confidence level is 91', () => {
      defaultProps.confidence = 91
      wrapper.setProps(defaultProps)
      expectedResult = {
        onClick: undefined,
        symbol: defaultProps.confidence,
        title: localize(Localization.HIGH_CONFIDENCE_LEVEL, { confidence: defaultProps.confidence }),
        tooltipPlacement: Placement.TOP,
        type: FlagType.SUCCESS,
      }
      expect(wrapper.find(Flag).props()).toEqual(expectedResult)
    })

    it('should render ConfidenceFlag as icon with correct properties in case there is low confidence level is 80', () => {
      ENV.FEATURE_CONFIDENCE_LEVEL_VIEW = 'asIcons'
      expectedResult = {
        onClick: undefined,
        symbol: localize(Localization.LOW_CONFIDENCE_LEVEL_FLAG),
        title: null,
        tooltipPlacement: Placement.TOP,
        type: FlagType.ERROR,
      }
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
      expect(wrapper.find(Flag).props()).toEqual(expectedResult)
    })

    it('should render ConfidenceFlag as icon with correct properties in case there is medium confidence level is 81', () => {
      ENV.FEATURE_CONFIDENCE_LEVEL_VIEW = 'asIcons'
      defaultProps.confidence = 81
      wrapper.setProps(defaultProps)
      expectedResult = {
        onClick: undefined,
        symbol: localize(Localization.MEDIUM_CONFIDENCE_LEVEL_FLAG),
        title: null,
        tooltipPlacement: Placement.TOP,
        type: FlagType.WARNING,
      }
      expect(wrapper.find(Flag).props()).toEqual(expectedResult)
    })

    it('should render ConfidenceFlag as icon with correct properties in case there is high confidence level is 91', () => {
      ENV.FEATURE_CONFIDENCE_LEVEL_VIEW = 'asIcons'
      defaultProps.confidence = 91
      wrapper.setProps(defaultProps)
      expectedResult = {
        onClick: undefined,
        symbol: localize(Localization.HIGH_CONFIDENCE_LEVEL_FLAG),
        title: null,
        tooltipPlacement: Placement.TOP,
        type: FlagType.SUCCESS,
      }
      expect(wrapper.find(Flag).props()).toEqual(expectedResult)
    })

    it('should not render ConfidenceFlag in case ENV.FEATURE_CONFIDENCE_LEVEL_VIEW is disabled', () => {
      ENV.FEATURE_CONFIDENCE_LEVEL_VIEW = false

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
      expect(wrapper.find(Flag).exists()).toBe(false)
    })

    it('should render NOT_APPLICABLE flag in case confidence property is not defined', () => {
      ENV.FEATURE_CONFIDENCE_LEVEL_VIEW = true
      defaultProps.confidence = undefined
      expectedResult = {
        symbol: localize(Localization.NA_CONFIDENCE_LEVEL_FLAG),
        title: localize(Localization.NA_CONFIDENCE_LEVEL_TOOLTIP),
        type: FlagType.NOT_APPLICABLE,
        onClick: undefined,
        tooltipPlacement: Placement.TOP,
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
      expect(wrapper.find(Flag).props()).toEqual(expectedResult)
    })
  })
})
