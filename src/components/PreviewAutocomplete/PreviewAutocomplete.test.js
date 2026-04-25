
import { shallow } from 'enzyme'
import { Input } from '@/components/Input'
import { ListItem } from './PreviewAutocomplete.styles'
import { PreviewAutocomplete } from '.'

const mockEvent = {
  target: {
    value: 'mock',
    dataset: {
      text: 'Mock Text',
      value: 'MockValue',
    },
  },
}

describe('Component: PreviewAutocomplete', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      dataSource: [{
        text: 'test text',
        value: 'testValue',
      }],
      placeholder: 'placeholder',
      onChange: jest.fn(),
    }

    wrapper = shallow(<PreviewAutocomplete {...defaultProps} />)
  })

  it('should render PreviewAutocomplete with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should pass correct handler to Input as onChange prop', () => {
    const inputProps = wrapper.find(Input).props()
    expect(inputProps.onChange).toEqual(wrapper.instance().onChangeSearchString)
  })

  it('should call onChange prop with null in case Input onChange call', () => {
    const inputProps = wrapper.find(Input).props()
    inputProps.onChange(mockEvent)
    expect(defaultProps.onChange).nthCalledWith(1, null)
  })

  it('should call onChange prop with correct value in case ListItem onClick call', () => {
    const listItemProps = wrapper.find(ListItem).props()
    listItemProps.onClick()
    expect(defaultProps.onChange).nthCalledWith(1, defaultProps.dataSource[0].value)
  })

  it('should pass correct value to Input in case ListItem onClick call', () => {
    const listItemProps = wrapper.find(ListItem).props()
    listItemProps.onClick()
    const inputProps = wrapper.find(Input).props()
    expect(inputProps.value).toEqual(wrapper.state().searchString)
    expect(inputProps.value).toEqual(defaultProps.dataSource[0].text)
  })

  it('should render emptySearchText in case dataSource is empty and emptySearchText is passed', () => {
    const props = {
      dataSource: [],
      emptySearchText: 'empty Search Text',
    }
    expect(shallow(<PreviewAutocomplete {...props} />)).toMatchSnapshot()
  })
})
