
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { StatisticCard } from '@/components/StatisticCard'
import { TrialLimitationCard } from './TrialLimitationCard'
import { Hint } from './TrialLimitationCard.styles'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: TrialLimitationCard', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      name: 'allTemplates',
      currentValue: 5000,
      limitValue: 10000,
    }

    wrapper = shallow(<TrialLimitationCard {...defaultProps} />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render hint if current value is equal to limit value', () => {
    defaultProps.currentValue = defaultProps.limitValue

    wrapper.setProps(defaultProps)

    const Extra = wrapper.props().renderExtra
    const hintComponent = shallow(<Extra />)

    expect(hintComponent.find(Hint).exists()).toBe(true)
  })

  it('should not render Statistic Card if limitation has no current value', () => {
    defaultProps.currentValue = null

    wrapper.setProps(defaultProps)

    expect(wrapper.find(StatisticCard).exists()).toBe(false)
  })
})
