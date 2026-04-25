
import { mockEnv } from '@/mocks/mockEnv'
import ShallowRenderer from 'react-test-renderer/shallow'
import { ConfidenceLevel, ConfidenceLevelView } from '@/enums/ConfidenceLevel'
import { ENV } from '@/utils/env'
import { ConfidenceLevelRangeHint } from './ConfidenceLevelRangeHint'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ConfidenceLevelRangeHint', () => {
  it('should render correctly', () => {
    const defaultProps = {
      confidenceLevel: ConfidenceLevel.LOW,
    }
    const renderer = new ShallowRenderer()
    const wrapper = renderer.render(<ConfidenceLevelRangeHint {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly if confidence level view is displayed as icons', () => {
    ENV.FEATURE_CONFIDENCE_LEVEL_VIEW = ConfidenceLevelView.AS_ICONS

    const defaultProps = {
      confidenceLevel: ConfidenceLevel.LOW,
    }
    const renderer = new ShallowRenderer()
    const wrapper = renderer.render(<ConfidenceLevelRangeHint {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })
})
