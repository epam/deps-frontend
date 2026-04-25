
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { TextArea } from './ChatInput.styles'
import { ChatInput } from '.'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ChatInput', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      prompt: '',
      setPrompt: jest.fn(),
      disabled: false,
      saveDialog: jest.fn(),
    }

    wrapper = shallow(<ChatInput {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call setPrompt when change input value', async () => {
    const mockInputValue = 'mockValue'

    const changeEvent = {
      target: {
        value: mockInputValue,
      },
    }

    wrapper.find(TextArea).props().onChange(changeEvent)

    expect(defaultProps.setPrompt).nthCalledWith(1, mockInputValue)
  })

  it('should not call saveDialog when Enter is pressed with Shift key', () => {
    const event = {
      preventDefault: jest.fn(),
      shiftKey: true,
    }
    wrapper.find(TextArea).simulate('pressEnter', event)
    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(defaultProps.saveDialog).not.toHaveBeenCalled()
  })

  it('should call saveDialog when Enter is pressed', () => {
    const event = {
      preventDefault: jest.fn(),
      shiftKey: false,
    }
    wrapper.find(TextArea).simulate('pressEnter', event)
    expect(event.preventDefault).toHaveBeenCalled()
    expect(defaultProps.saveDialog).toHaveBeenCalled()
  })
})
