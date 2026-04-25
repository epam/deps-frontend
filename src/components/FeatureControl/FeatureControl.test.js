
import { shallow } from 'enzyme'
import { isFeatureEnabled } from '@/utils/features'
import { FeatureControl } from './FeatureControl'

jest.mock('@/utils/features', () => ({
  isFeatureEnabled: jest.fn(),
}))

describe('Components: FeatureControl', () => {
  const children = <div>Mock Component</div>

  it('should render children if feature is enabled:', () => {
    isFeatureEnabled.mockImplementationOnce(() => true)
    const wrapper = shallow(
      <FeatureControl>
        {children}
      </FeatureControl>,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should render null if feature is disabled:', () => {
    isFeatureEnabled.mockImplementationOnce(() => false)
    const wrapper = shallow(
      <FeatureControl>
        {children}
      </FeatureControl>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
