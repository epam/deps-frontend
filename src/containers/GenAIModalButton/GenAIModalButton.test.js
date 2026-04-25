
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import flushPromises from 'flush-promises'
import { act } from 'react-dom/test-utils'
import { removeChatDialogs, storeChatDialogs } from '@/actions/genAiChat'
import { getAiConversationData } from '@/api/aiConversationApi'
import { AiContext } from '@/containers/GenAIModalButton/AiContextSelect'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { Localization, localize } from '@/localization/i18n'
import { AICompletion, AIConversation } from '@/models/AIConversation'
import { GenAiChatDialog, GenAiChatMessage } from '@/models/GenAiChatDialog'
import { LLModel, LLMProvider } from '@/models/LLMProvider'
import { idSelector } from '@/selectors/documentReviewPage'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { GenAIModalButton } from './GenAIModalButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/GenAiChat', () => mockComponent('GenAiChat'))
jest.mock('@/containers/LLMSettingsDrawer', () => mockComponent('LLMSettingsDrawer'))
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/containers/PageSettingsModal', () => ({
  PageSettingsModal: () => <div data-testid='page-settings' />,
}))

let capturedAiContextSelectOnChange = null
let capturedSetActiveLLMSettings = null

jest.mock('@/containers/GenAIModalButton/AiContextSelect', () => {
  const { AiContext } = jest.requireActual('@/containers/GenAIModalButton/AiContextSelect')

  return {
    AiContext,
    AiContextSelect: ({ value, onChange }) => {
      capturedAiContextSelectOnChange = onChange
      return (
        <div
          data-testid='ai-context-select'
          data-value={value}
        />
      )
    },
  }
})

jest.mock('@/containers/SelectLLMSettingsButton', () => ({
  SelectLLMSettingsButton: ({ setActiveLLMSettings }) => {
    capturedSetActiveLLMSettings = setActiveLLMSettings
    return <div data-testid='select-llm-settings-button' />
  },
}))

jest.mock('@/api/aiConversationApi', () => ({
  getAiConversationData: jest.fn(() => Promise.resolve(mockConversationData)),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
}))

const mockDispatch = jest.fn((action) => action)

const mockConversationData = {
  conversation: new AIConversation({
    entityId: 'entityId',
    userId: 'userId',
    tenantId: 'tenantId',
    completions: [
      new AICompletion({
        code: 'completionCode',
        question: 'Question',
        response: 'response',
        createdAt: '11-11-2002',
        provider: 'providerCode',
        model: 'modelCode',
      }),
    ],
  }),
  providers: [
    new LLMProvider({
      code: 'providerCode',
      name: 'provider',
      models: [
        new LLModel({
          code: 'modelCode',
          name: 'model',
          description: 'description',
          contextType: LLMModelContextType.TEXT_BASED,
        }),
      ],
    }),
  ],
}

beforeEach(() => {
  jest.clearAllMocks()
  capturedAiContextSelectOnChange = null
  capturedSetActiveLLMSettings = null
})

test('shows correct tooltip text when hover on trigger button', async () => {
  render(
    <GenAIModalButton
      isModalVisible={false}
      toggleModal={jest.fn()}
    />,
  )

  const triggerButton = screen.getByRole('button', {
    name: localize(Localization.OPEN_CHAT),
  })
  await userEvent.hover(triggerButton)

  expect(await screen.findByText(localize(Localization.OPEN_CHAT))).toBeInTheDocument()
})

test('shows genAI modal in case modal is toggled on', async () => {
  render(
    <GenAIModalButton
      isModalVisible={false}
      toggleModal={jest.fn()}
    />,
  )

  await waitFor(() => {
    expect(screen.queryByRole('heading', {
      level: 4,
      name: localize(Localization.CHAT),
    })).not.toBeInTheDocument()
  })

  render(
    <GenAIModalButton
      isModalVisible={true}
      toggleModal={jest.fn()}
    />,
  )

  await waitFor(() => {
    expect(screen.getByRole('heading', {
      level: 4,
      name: localize(Localization.CHAT),
    })).toBeInTheDocument()
  })
})

test('calls toggleModal prop in case user clicks on open chat button', async () => {
  const toggleModal = jest.fn()
  render(
    <GenAIModalButton
      isModalVisible={false}
      toggleModal={toggleModal}
    />,
  )

  const triggerButton = screen.getByRole('button', {
    name: localize(Localization.OPEN_CHAT),
  })
  await userEvent.click(triggerButton)

  expect(toggleModal).toHaveBeenCalled()
})

test('calls toggleModal prop in case user clicks on close icon', async () => {
  const toggleModal = jest.fn()
  render(
    <GenAIModalButton
      isModalVisible={true}
      toggleModal={toggleModal}
    />,
  )

  const closeIcon = screen.getByLabelText(localize(Localization.CLOSE))
  await userEvent.click(closeIcon)

  expect(toggleModal).toHaveBeenCalled()
})

test('calls getAiConversationData when modal is visible', async () => {
  render(
    <GenAIModalButton
      isModalVisible={true}
      toggleModal={jest.fn()}
    />,
  )

  await waitFor(() => {
    expect(getAiConversationData).nthCalledWith(1, idSelector.getSelectorMockValue())
  })
})

test('calls notifyWarning if getAiConversationData request fails', async () => {
  getAiConversationData.mockRejectedValueOnce(new Error('test'))

  render(
    <GenAIModalButton
      isModalVisible={true}
      toggleModal={jest.fn()}
    />,
  )

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(1, localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE))
  })
})

test('calls dispatch with storeChatDialogs if getConversationData return completions', async () => {
  render(
    <GenAIModalButton
      isModalVisible={true}
      toggleModal={jest.fn()}
    />,
  )

  const [completion] = mockConversationData.conversation.completions
  const { response, question, code, model, provider } = completion

  const expectedResult = [
    new GenAiChatDialog({
      id: code,
      documentId: idSelector.getSelectorMockValue(),
      model,
      provider,
      prompt: new GenAiChatMessage('00:00', question),
      answer: new GenAiChatMessage('00:00', response),
    }),
  ]

  await waitFor(() => {
    expect(mockDispatch).nthCalledWith(1, storeChatDialogs(expectedResult))
  })
})

test('shows Page Settings button', async () => {
  render(
    <GenAIModalButton
      isModalVisible={true}
      toggleModal={jest.fn()}
    />,
  )

  await waitFor(() => {
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
  })
})

test('renders AiContextSelect when model is multimodal', async () => {
  const multimodalConversationData = {
    conversation: new AIConversation({
      entityId: 'entityId',
      userId: 'userId',
      tenantId: 'tenantId',
      completions: [
        new AICompletion({
          code: 'completionCode',
          question: 'Question',
          response: 'response',
          createdAt: '11-11-2002',
          provider: 'providerCode',
          model: 'multimodalModelCode',
        }),
      ],
    }),
    providers: [
      new LLMProvider({
        code: 'providerCode',
        name: 'provider',
        models: [
          new LLModel({
            code: 'multimodalModelCode',
            name: 'multimodal model',
            description: 'multimodal description',
            contextType: LLMModelContextType.MULTIMODAL,
          }),
        ],
      }),
    ],
  }

  getAiConversationData.mockResolvedValueOnce(multimodalConversationData)

  render(
    <GenAIModalButton
      isModalVisible={true}
      toggleModal={jest.fn()}
    />,
  )

  await waitFor(() => {
    expect(screen.getByTestId('ai-context-select')).toBeInTheDocument()
  })
})

test('does not render AiContextSelect when model is not multimodal', async () => {
  const textBasedConversationData = {
    conversation: new AIConversation({
      entityId: 'entityId',
      userId: 'userId',
      tenantId: 'tenantId',
      completions: [
        new AICompletion({
          code: 'completionCode',
          question: 'Question',
          response: 'response',
          createdAt: '11-11-2002',
          provider: 'providerCode',
          model: 'textModelCode',
        }),
      ],
    }),
    providers: [
      new LLMProvider({
        code: 'providerCode',
        name: 'provider',
        models: [
          new LLModel({
            code: 'textModelCode',
            name: 'text model',
            description: 'text description',
            contextType: LLMModelContextType.TEXT_BASED,
          }),
        ],
      }),
    ],
  }

  getAiConversationData.mockResolvedValueOnce(textBasedConversationData)

  render(
    <GenAIModalButton
      isModalVisible={true}
      toggleModal={jest.fn()}
    />,
  )

  await waitFor(() => {
    expect(screen.queryByTestId('ai-context-select')).not.toBeInTheDocument()
  })
})

test('clears dialogs on unmount', async () => {
  const { unmount } = render(
    <GenAIModalButton
      isModalVisible={true}
      toggleModal={jest.fn()}
    />,
  )

  await act(() => flushPromises())

  jest.clearAllMocks()

  unmount()

  expect(mockDispatch).nthCalledWith(1, removeChatDialogs(idSelector.getSelectorMockValue()))
})

test('resets aiContext to TEXT_ONLY when LLM settings change', async () => {
  const multimodalConversationData = {
    conversation: new AIConversation({
      entityId: 'entityId',
      userId: 'userId',
      tenantId: 'tenantId',
      completions: [
        new AICompletion({
          code: 'completionCode',
          question: 'Question',
          response: 'response',
          createdAt: '11-11-2002',
          provider: 'providerCode',
          model: 'multimodalModelCode',
        }),
      ],
    }),
    providers: [
      new LLMProvider({
        code: 'providerCode',
        name: 'provider',
        models: [
          new LLModel({
            code: 'multimodalModelCode',
            name: 'multimodal model',
            description: 'multimodal description',
            contextType: LLMModelContextType.MULTIMODAL,
          }),
        ],
      }),
    ],
  }

  getAiConversationData.mockResolvedValueOnce(multimodalConversationData)

  render(
    <GenAIModalButton
      isModalVisible={true}
      toggleModal={jest.fn()}
    />,
  )

  await waitFor(() => {
    expect(screen.getByTestId('ai-context-select')).toBeInTheDocument()
  })

  await act(async () => {
    capturedAiContextSelectOnChange(AiContext.TEXT_AND_IMAGES)
  })

  await waitFor(() => {
    expect(screen.getByTestId('ai-context-select')).toHaveAttribute('data-value', AiContext.TEXT_AND_IMAGES)
  })

  await act(async () => {
    capturedSetActiveLLMSettings({
      provider: 'providerCode',
      model: 'multimodalModelCode',
    })
  })

  await waitFor(() => {
    expect(screen.getByTestId('ai-context-select')).toHaveAttribute('data-value', AiContext.TEXT_ONLY)
  })
})
