
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { mockUuid } from '@/mocks/mockUuid'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import React from 'react'
import { storeChatDialog, updateDialogAnswer } from '@/actions/genAiChat'
import { createAiCompletion } from '@/api/aiConversationApi'
import { Document } from '@/models/Document'
import { DocumentType } from '@/models/DocumentType'
import { LLMSettings } from '@/models/LLMProvider'
import { documentChatDialogsSelector } from '@/selectors/genAiChat'
import { ChatCommandBar } from './ChatCommandBar'
import { ChatInput } from './ChatInput'
import { EmptyChatImage, Spin } from './GenAiChat.styles'
import { GenAiChat } from '.'

const mockDispatch = jest.fn((action) => action)
const mockPrompt = 'userPrompt'
const mockDocument = new Document({
  id: 'id',
  documentType: new DocumentType('code', 'name'),
})

const mockActions = {
  storeChatDialog: 'storeChatDialog',
  updateDialogAnswer: 'updateDialogAnswer',
}

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage', () => ({
  documentSelector: jest.fn(() => mockDocument),
}))
jest.mock('@/selectors/genAiChat')
jest.mock('uuid', () => mockUuid)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/api/aiConversationApi', () => ({
  createAiCompletion: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/actions/genAiChat', () => ({
  storeChatDialog: jest.fn(() => mockActions.storeChatDialog),
  updateDialogAnswer: jest.fn(() => mockActions.updateDialogAnswer),
}))

jest.spyOn(React, 'useRef').mockReturnValue({
  current: {
    scrollTo: jest.fn(),
    scrollHeight: '',
  },
})

describe('Container: GenAiChat', () => {
  let defaultProps, wrapper

  beforeEach(() => {
    defaultProps = {
      activeLLMSettings: new LLMSettings({
        provider: 'mockProvider',
        model: 'mockLLM',
      }),
      pageSpan: ['1', '2'],
      isFetching: false,
    }

    jest.clearAllMocks()

    wrapper = shallow(<GenAiChat {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call dispatch with storeChatDialog action when click on saveDialog button', async () => {
    wrapper.find(ChatInput).props().setPrompt(mockPrompt)
    wrapper.find(ChatCommandBar).props().saveDialog()

    await flushPromises()

    expect(mockDispatch).nthCalledWith(1, storeChatDialog())
  })

  it('should call createAiCompletion when click on saveDialog button', async () => {
    wrapper.find(ChatInput).props().setPrompt(mockPrompt)
    wrapper.find(ChatCommandBar).props().saveDialog()

    await flushPromises()

    expect(createAiCompletion).nthCalledWith(1,
      mockDocument._id,
      {
        ...defaultProps.activeLLMSettings,
        pageSpan: defaultProps.pageSpan,
        question: mockPrompt,
      },
    )
  })

  it('should not pass page span as argument to createAiCompletion if page span is empty', async () => {
    defaultProps.pageSpan = []
    wrapper = shallow(<GenAiChat {...defaultProps} />)

    wrapper.find(ChatInput).props().setPrompt(mockPrompt)
    wrapper.find(ChatCommandBar).props().saveDialog()

    await flushPromises()

    expect(createAiCompletion).nthCalledWith(1,
      mockDocument._id,
      {
        ...defaultProps.activeLLMSettings,
        question: mockPrompt,
      },
    )
  })

  it('should call dispatch with updateDialogAnswer action when click on saveDialog button', async () => {
    wrapper.find(ChatInput).props().setPrompt(mockPrompt)
    wrapper.find(ChatCommandBar).props().saveDialog()

    await flushPromises()

    expect(mockDispatch).nthCalledWith(2, updateDialogAnswer())
  })

  it('should call dispatch with updateDialogAnswer action if createAiCompletion rejects with error', async () => {
    createAiCompletion.mockImplementationOnce(() => Promise.reject(new Error('test')))

    wrapper = shallow(<GenAiChat {...defaultProps} />)
    wrapper.find(ChatInput).props().setPrompt(mockPrompt)
    wrapper.find(ChatCommandBar).props().saveDialog()

    await flushPromises()

    expect(mockDispatch).nthCalledWith(2, updateDialogAnswer())
  })

  it('should disable chat input if no llm settings', async () => {
    wrapper.setProps({
      ...defaultProps,
      activeLLMSettings: null,
    })

    expect(wrapper.find(ChatInput).props().disabled).toBe(true)
  })

  it('should disable chat input if createAiCompletion request is in progress', async () => {
    wrapper = shallow(<GenAiChat {...defaultProps} />)
    wrapper.find(ChatInput).props().setPrompt(mockPrompt)
    wrapper.find(ChatCommandBar).props().saveDialog()

    expect(wrapper.find(ChatInput).props().disabled).toBe(true)
  })

  it('should not call dispatch with storeChatDialog action if prompt is empty', async () => {
    wrapper.find(ChatInput).props().setPrompt('')
    wrapper.find(ChatCommandBar).props().saveDialog()

    await flushPromises()

    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should render EmptyImage in case no dialogs', () => {
    documentChatDialogsSelector.mockImplementationOnce(() => [])

    wrapper = shallow(<GenAiChat {...defaultProps} />)
    expect(wrapper.find(EmptyChatImage).exists()).toBe(true)
  })

  it('should show spinner in case prop isFetching is true', () => {
    wrapper.setProps({
      ...defaultProps,
      isFetching: true,
    })

    expect(wrapper.find(Spin).props().spinning).toBe(true)
  })

  it('should include files in createAiCompletion request when files prop is provided', async () => {
    const mockFiles = ['blob-2.png', 'blob-3.png']

    wrapper = shallow(
      <GenAiChat
        {...defaultProps}
        files={mockFiles}
      />,
    )

    wrapper.find(ChatInput).props().setPrompt(mockPrompt)
    wrapper.find(ChatCommandBar).props().saveDialog()

    await flushPromises()

    expect(createAiCompletion).nthCalledWith(1,
      mockDocument._id,
      {
        ...defaultProps.activeLLMSettings,
        pageSpan: defaultProps.pageSpan,
        question: mockPrompt,
        files: mockFiles,
      },
    )
  })
})
