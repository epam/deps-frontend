
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { StyledInput } from './FieldsSearchInput.styles'
import { FieldsSearchInput } from '.'

const DEBOUNCE_TIME = 500

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react', () => mockReact())

describe('Component: FieldSearchInput', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      onChange: jest.fn(),
      shouldClear: false,
    }

    wrapper = shallow(<FieldsSearchInput {...defaultProps} />)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call prop.onChange with debounce delay', async () => {
    const mockInputValue = 'mockValue'

    const changeEvent = {
      target: {
        value: mockInputValue,
      },
    }

    const Input = wrapper.find(StyledInput)

    Input.props().onChange(changeEvent)

    expect(defaultProps.onChange).not.toBeCalled()

    jest.advanceTimersByTime(DEBOUNCE_TIME)

    expect(defaultProps.onChange).nthCalledWith(1, mockInputValue)
  })

  it('should call props.onChange with correct argument if prop.shouldClear is true', () => {
    wrapper.setProps({
      ...defaultProps,
      shouldClear: true,
    })

    jest.advanceTimersByTime(DEBOUNCE_TIME)

    expect(defaultProps.onChange).nthCalledWith(1, '')
  })
})
