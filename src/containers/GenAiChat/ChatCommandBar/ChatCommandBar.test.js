
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { CommandBar } from '@/components/CommandBar'
import { Document } from '@/models/Document'
import { DocumentType } from '@/models/DocumentType'
import { GenAiChatDialog, GenAiChatMessage } from '@/models/GenAiChatDialog'
import { ChatCommandBar } from './ChatCommandBar'

const mockDocument = new Document({
  id: 'id',
  title: 'title',
  documentType: new DocumentType('code', 'name'),
})

const mockDialog = new GenAiChatDialog({
  id: 'dialogId',
  documentId: mockDocument._id,
  model: 'model',
  provider: 'provider',
  prompt: new GenAiChatMessage('11:12', 'prompt'),
  answer: new GenAiChatMessage('11:12', 'answerItem'),
})

jest.mock('@/utils/env', () => mockEnv)

describe('Container: ChatCommandBar', () => {
  let defaultProps
  let wrapper

  const getCommandBarCommands = (wrapper) => (
    wrapper.find(CommandBar).props().commands
  )

  beforeEach(() => {
    defaultProps = {
      dialogs: [mockDialog],
      saveDialog: jest.fn(),
      isSendPromptDisabled: false,
      document: mockDocument,
    }

    wrapper = shallow(<ChatCommandBar {...defaultProps} />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render commands correctly', () => {
    const commands = getCommandBarCommands(wrapper)

    commands.forEach((c) => {
      expect(<div>{c.renderComponent()}</div>).toMatchSnapshot()
    })
  })

  it('should render disabled MoreOptions if no dialogs are provided', () => {
    defaultProps.dialogs = []
    wrapper.setProps(defaultProps)

    const commands = getCommandBarCommands(wrapper)

    expect(commands[1].renderComponent().props.disabled).toBe(true)
  })

  it('should call saveDialog when click on save icon button', () => {
    const commands = getCommandBarCommands(wrapper)
    commands[0].renderComponent().props.onClick()

    expect(defaultProps.saveDialog).toHaveBeenCalled()
  })

  it('should disable send button when isSendPromptDisabled is true', () => {
    wrapper.setProps({ isSendPromptDisabled: true })
    const commands = getCommandBarCommands(wrapper)

    expect(commands[0].renderComponent().props.disabled).toBe(true)
  })
})
