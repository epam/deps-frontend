
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { GenAiChatMessage } from '@/models/GenAiChatDialog'
import { DeletePromptButton } from '../DeletePromptButton'
import { MessageWrapper } from './UserPrompt.styles'
import { UserPrompt } from '.'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  ...mockReactRedux,
}))
jest.mock('@/selectors/documentReviewPage')

const mockPrompt = new GenAiChatMessage(
  '11:12',
  'test',
)

describe('Component: UserPrompt', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      prompt: mockPrompt,
      messageId: 'some-message-id',
    }

    wrapper = shallow(<UserPrompt {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should toggle delete button visibility on mouse enter and leave', () => {
    wrapper.find(MessageWrapper).props().onMouseEnter()

    expect(wrapper.find(DeletePromptButton).exists()).toBe(true)

    wrapper.find(MessageWrapper).props().onMouseLeave()

    expect(wrapper.find(DeletePromptButton).exists()).toBe(false)
  })
})
