
import { shallow } from 'enzyme'
import { CustomSelect } from './CustomSelect'

const MOCK_VALUE_1 = 'MOCK_VALUE_1'
const MOCK_VALUE_2 = 'MOCK_VALUE_2'

describe('Component: Select', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      allowSearch: true,
      allowClear: true,
      placeholder: 'MOCK_PLACEHOLDER',
      value: [MOCK_VALUE_1],
      onChange: jest.fn(),
      options: [
        {
          value: MOCK_VALUE_1,
          text: 'MOCK_TEXT_1',
        }, {
          value: MOCK_VALUE_2,
          text: 'MOCK_TEXT_2',
        },
      ],
      dropdownRender: jest.fn(),
      onSearch: jest.fn(),
      dropdownMatchSelectWidth: true,
      fetching: false,
    }

    wrapper = shallow(<CustomSelect {...defaultProps} />)
  })

  it('should render antd Select with correct value and options', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should pass correct onChange callback to antd Select', () => {
    expect(wrapper.props().onChagne).toEqual(defaultProps.onChagne)
  })

  it('should pass correct filterOption callback to the antd Select', () => {
    expect(wrapper.props().filterOption).toEqual(wrapper.instance().filterOption)
  })

  it('should pass correct tagRender to the antd Select if tagRender prop was passed ', () => {
    wrapper.setProps({
      ...defaultProps,
      tagRender: () => <div />,
    })

    expect(wrapper.props().tagRender).toEqual(wrapper.instance().tagRender)
  })

  it('should filter options in case insensitive manner', () => {
    const options = [{
      content: 'Minsk',
      expected: true,
    }, {
      content: 'Paris',
      expected: false,
    }, {
      content: 'Milan',
      expected: true,
    }, {
      content: {},
      expected: false,
    }]

    const searchStr = 'mI'

    options.forEach((o) => {
      const option = {
        children: o.content,
      }

      const output = wrapper.instance().filterOption(searchStr, option)
      expect(output).toEqual(o.expected)
    })
  })
})
