
import { shallow } from 'enzyme'
import { Input } from './Input'
import { StyledInput } from './Input.styles'

describe('Component: Input', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      onChange: jest.fn(),
      onBlur: jest.fn(),
      onPressEnter: jest.fn(),
      value: 'MOCK_VALUE',
      placeholder: 'MOCK_PLACEHOLDER',
      disabled: false,
    }

    wrapper = shallow(<Input {...defaultProps} />)
  })

  it('should render antd Input with and pass correctly props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should pass correct callback to the antd Input onChange prop', () => {
    expect(wrapper.props().onChange).toEqual(defaultProps.onChange)
  })

  it('should disable input if disabled prop is set to true', () => {
    defaultProps.disabled = true
    wrapper.setProps(defaultProps)
    expect(wrapper.props().onChange).toEqual(defaultProps.onChange)
  })

  it('should pass correct callback to antdInput component', () => {
    const props = wrapper.dive().find(StyledInput).props()

    expect(props.onChange).toEqual(defaultProps.onChange)
    expect(props.onPressEnter).toEqual(defaultProps.onPressEnter)
    expect(props.onBlur).toEqual(defaultProps.onBlur)
  })
})
