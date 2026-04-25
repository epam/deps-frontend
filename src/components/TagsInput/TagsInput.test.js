
import { shallow } from 'enzyme'
import { Input } from '@/components/Input'
import { Tag } from './Tag'
import { TagsInput } from './TagsInput'

describe('Component: TagsInput', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      onChange: jest.fn(),
      value: ['test1', 'test2'],
      placeholder: 'mockPlaceholder',
    }

    wrapper = shallow(<TagsInput {...defaultProps} />)
  })

  it('should render correct TagsInput with passed props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render tags according to value passed in props', () => {
    wrapper.setProps({
      ...defaultProps,
      value: ['test1', 'test2', 'test3'],
    })

    expect(wrapper.find(Tag)).toHaveLength(3)
  })

  it('should pass correct callbacks to the Input component', () => {
    const instance = wrapper.instance()
    const props = wrapper.find(Input).props()

    expect(props.onPressEnter).toEqual(instance.handleInputConfirm)
    expect(props.onBlur).toEqual(instance.handleInputConfirm)
    expect(props.onChange).toEqual(instance.handleInputChange)
  })

  it('should call onChange callback when onBlur methods is called with correct values', () => {
    const props = wrapper.find(Input).props()
    const expectedOutput = [...defaultProps.value, 'test3']

    props.onChange({
      target: {
        value: 'test3',
      },
    })
    props.onBlur()

    expect(defaultProps.onChange).toHaveBeenCalledWith(expectedOutput)
  })

  it('should call onChange callback when onPressEnter methods is called with correct values', () => {
    const props = wrapper.find(Input).props()
    const expectedOutput = [...defaultProps.value, 'test3']

    props.onChange({
      target: {
        value: 'test3',
      },
    })
    props.onPressEnter()

    expect(defaultProps.onChange).toHaveBeenCalledWith(expectedOutput)
  })

  it('should update input`s value when onChange callback is called', () => {
    const props = wrapper.find(Input).props()

    props.onChange({
      target: {
        value: 'test',
      },
    })

    const newProps = wrapper.find(Input).props()

    expect(newProps.value).toBe('test')
  })
})
