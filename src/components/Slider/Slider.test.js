
import { shallow } from 'enzyme'
import { StyledSlider, SliderButton, ScaleInputNumber } from './Slider.styles'
import { Slider } from './'

const mockValue = 2

describe('Component: Slider', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      className: 'HolaAmigos',
      disabled: false,
      max: 3,
      min: 1,
      onChange: jest.fn(),
      step: 1,
      value: 1,
      valuePrefix: '',
    }

    wrapper = shallow(<Slider {...defaultProps} />)
  })

  it('should render correct Slider layout according to props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call onChange prop with correct value in case StyledSlider onChange call', () => {
    const antdSlider = wrapper.find(StyledSlider).props()
    antdSlider.onChange(mockValue)
    expect(defaultProps.onChange).nthCalledWith(1, mockValue)
  })

  it('should call onChange prop with correct value in case ScaleInputNumber onChange call', () => {
    const inputProps = wrapper.find(ScaleInputNumber).props()
    inputProps.onChange(mockValue)
    expect(defaultProps.onChange).nthCalledWith(1, mockValue)
  })

  it('should pass correct onClick handler to decrement SliderButton', () => {
    const sliderButton = wrapper.find(SliderButton).at(0)
    expect(sliderButton.props().onClick).toEqual(wrapper.instance().decrementValue)
  })

  it('should call onChange prop with correct value in case decrementValue was called', () => {
    wrapper.instance().decrementValue()
    expect(defaultProps.onChange).nthCalledWith(1, defaultProps.value - defaultProps.step)
  })

  it('should pass correct onClick handler to increment SliderButton', () => {
    const sliderButton = wrapper.find(SliderButton).at(1)
    expect(sliderButton.props().onClick).toEqual(wrapper.instance().incrementValue)
  })

  it('should call onChange prop with correct value in case incrementValue was called', () => {
    wrapper.instance().incrementValue()
    expect(defaultProps.onChange).nthCalledWith(1, defaultProps.value + defaultProps.step)
  })
})
