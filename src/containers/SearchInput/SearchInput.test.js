
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import lodashDebounce from 'lodash/debounce'
import React from 'react'
import { SearchInput } from './SearchInput'
import { Input } from './SearchInput.styles'

jest.mock('lodash/debounce', () =>
  jest.fn((fn) => fn),
)

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(() => ['test', jest.fn]),
  useEffect: jest.fn((f) => f()),
}))
jest.mock('@/utils/env', () => mockEnv)

const mockEventObject = {
  target: {
    value: 'test',
  },
}

describe('Components: SearchInput', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      filter: 'search',
      onChange: jest.fn(() => 'test_value'),
      autoFocus: false,
      onClick: jest.fn(),
    }
    wrapper = shallow(<SearchInput {...defaultProps} />)
  })

  it('should render Input with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call lodashDebounce when input value changed', () => {
    wrapper.find(Input).props().onChange(mockEventObject)
    expect(lodashDebounce).toHaveBeenCalled()
  })

  it('should call onSearch when enter key pressed', () => {
    wrapper.find(Input).props().onPressEnter()
    expect(defaultProps.onChange).nthCalledWith(1, 'test')
  })

  it('should call onSearch when click on SearchIcon', () => {
    wrapper.find(Input).props().suffix.props.onClick()
    expect(defaultProps.onChange).nthCalledWith(1, 'test')
  })

  it('should pass autoFocus prop correctly to Input component', () => {
    expect(wrapper.find(Input).prop('autoFocus')).toBe(false)

    wrapper.setProps({ autoFocus: true })
    expect(wrapper.find(Input).prop('autoFocus')).toBe(true)
  })

  it('should call onClick when click on SearchIcon', () => {
    wrapper.find(Input).props().onClick()
    expect(defaultProps.onClick).toHaveBeenCalled()
  })
})
