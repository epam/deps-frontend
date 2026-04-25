
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Spin } from '@/components/Spin'
import { GenAiChatMessage } from '@/models/GenAiChatDialog'
import { ENV } from '@/utils/env'
import { CopyToClipboardButton } from '../CopyToClipboardButton'
import { SaveToFieldButton } from '../SaveToFieldButton'
import { Message } from './AiAnswer.styles'
import { AiAnswer } from '.'

jest.mock('@/utils/env', () => mockEnv)

const mockMessage = new GenAiChatMessage(
  '11:12',
  'test',
)

describe('Component: AiAnswer', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      answer: mockMessage,
      prompt: mockMessage,
    }

    wrapper = shallow(<AiAnswer {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render spinner if answer message is undefined', () => {
    defaultProps.answer = {
      message: undefined,
      time: '11:22',
    }
    wrapper.setProps(defaultProps)

    expect(wrapper.find(Spin).exists()).toBe(true)
  })

  it('should not render content if answer is not provided', () => {
    defaultProps.answer = null

    wrapper.setProps(defaultProps)

    expect(wrapper.isEmptyRender()).toBe(true)
  })

  it('should not render save to field button if both flags FEATURE_ENRICHMENT and FEATURE_GEN_AI_KEY_VALUE_FIELDS are false', () => {
    ENV.FEATURE_ENRICHMENT = false
    ENV.FEATURE_GEN_AI_KEY_VALUE_FIELDS = false

    wrapper = shallow(<AiAnswer {...defaultProps} />)

    expect(wrapper.find(SaveToFieldButton).exists()).toEqual(false)
  })

  it('should toggle copy to clipboard button when onMouseEnter or onMouseLeave is called on the message', () => {
    wrapper.find(Message).props().onMouseEnter()

    expect(wrapper.find(CopyToClipboardButton).exists()).toBe(true)

    wrapper.find(Message).props().onMouseLeave()

    expect(wrapper.find(CopyToClipboardButton).exists()).toBe(false)
  })
})
