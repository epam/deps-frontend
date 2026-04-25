
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { InputNumber } from '@/components/InputNumber'
import { notifyWarning } from '@/utils/notification'
import { GoToPageInput } from './GoToPageInput'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => ({
  notifyWarning: jest.fn(),
}))

const mockEvent = {
  target: {
    value: 12,
  },
}

describe('Component: GoToPageInput', () => {
  window.addEventListener = jest.fn()

  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      goToPage: jest.fn(),
    }

    wrapper = shallow(<GoToPageInput {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call goToPage in case of pressing enter', () => {
    mockEvent.target.value = 12

    wrapper.find(InputNumber).props().onPressEnter(mockEvent)

    expect(defaultProps.goToPage).toBeCalled()
  })

  it('should not call goToPage in case of invalid value', () => {
    mockEvent.target.value = 12.45

    wrapper.find(InputNumber).props().onPressEnter(mockEvent)

    expect(defaultProps.goToPage).not.toBeCalled()
  })

  it('should call notifyWarning, in case of failed default validation', () => {
    mockEvent.target.value = 12.45

    wrapper.find(InputNumber).props().onPressEnter(mockEvent)

    expect(notifyWarning).toBeCalled()
  })

  it('should call goToPage in case of passed validator allows', () => {
    mockEvent.target.value = 12.45

    wrapper.setProps({
      ...defaultProps,
      validate: jest.fn(() => true),
    })

    wrapper.find(InputNumber).props().onPressEnter(mockEvent)

    expect(defaultProps.goToPage).toBeCalled()
  })

  it('should register window listener onFocus', () => {
    mockEvent.target.value = 12

    wrapper.find(InputNumber).props().onFocus(mockEvent)

    expect(window.addEventListener).toHaveBeenCalled()
  })
})
