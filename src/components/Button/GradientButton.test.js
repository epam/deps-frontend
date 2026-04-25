
import { shallow } from 'enzyme'
import { GradientButton } from './GradientButton'
import { ButtonType } from '.'

describe('Component: GradientButton', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      type: ButtonType.PRIMARY,
    }

    wrapper = shallow(<GradientButton {...defaultProps} />)
  })

  it('should render PrimaryGradientButton button according to prop', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render SecondaryGradientButton button according to prop', () => {
    wrapper.setProps({
      ...defaultProps,
      type: ButtonType.GHOST,
    })

    expect(wrapper).toMatchSnapshot()
  })
})
