
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { renderHook, act } from '@testing-library/react-hooks/dom'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { RequestMethod } from '@/enums/RequestMethod'
import { Localization, localize } from '@/localization/i18n'
import { apiMap } from '@/utils/apiMap'
import { jsonTryParse } from '@/utils/jsonTryParse'
import { createAuthenticatedEventSource } from '../utils/messageEventSource'
import { useAgenticChatStream } from './useAgenticChatStream'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/utils/jsonTryParse', () => ({
  jsonTryParse: jest.fn((data) => data),
}))
jest.mock('../utils/messageEventSource', () => ({
  createAuthenticatedEventSource: jest.fn(({ onMessage, onError }) => {
    onMessageCb = onMessage
    onErrorCb = onError
    return {
      close: mockClose,
    }
  }),
}))

const mockClose = jest.fn()
let onMessageCb
let onErrorCb

const finalMessage = {
  type: 'Final',
  text: 'Final text',
}

const errorMessage = {
  type: 'Error',
  text: 'Error text',
}

const props = {
  conversationId: 'id',
  userQuestion: 'Test question',
  chatArguments: {},
  onCompletionCreation: jest.fn(),
  onFinal: jest.fn(),
}

const editProps = {
  conversationId: 'id',
  userQuestion: 'Updated test question',
  completionId: 'completionId',
  chatArguments: {},
  onFinal: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns correct fields', () => {
  const { result } = renderHook(() => useAgenticChatStream())

  expect(result.current.createCompletion).toEqual(expect.any(Function))
  expect(result.current.isCompletionProcessing).toBe(false)
})

test('creates event source for completion creation with correct arguments', async () => {
  const { result } = renderHook(() => useAgenticChatStream())

  const creationURL = apiMap.apiGatewayV2.v5.agenticAi.conversations.conversation.chat({
    conversationId: props.conversationId,
    userQuestion: props.userQuestion,
    chatArguments: props.chatArguments,
  })

  await act(async () => {
    const promise = result.current.createCompletion(props)
    onMessageCb(finalMessage)
    await promise
  })

  expect(createAuthenticatedEventSource).nthCalledWith(
    1,
    {
      url: creationURL,
      onMessage: expect.any(Function),
      onError: expect.any(Function),
    })
})

test('handles successful messages while completion creation', async () => {
  const { result } = renderHook(() => useAgenticChatStream())

  await act(async () => {
    const promise = result.current.createCompletion(props)
    onMessageCb(finalMessage)
    await promise
  })

  expect(props.onCompletionCreation).toHaveBeenCalled()
  expect(props.onFinal).toHaveBeenCalled()
})

test('closes stream if message with type "Final" received', async () => {
  const { result } = renderHook(() => useAgenticChatStream())

  await act(async () => {
    const promise = result.current.createCompletion(props)
    expect(mockClose).not.toHaveBeenCalled()
    onMessageCb(finalMessage)
    expect(mockClose).toHaveBeenCalled()
    await promise
  })
})

test('handles error correctly and closes stream in case if message parsing failed', async () => {
  jsonTryParse.mockImplementationOnce(() => null)
  const { result } = renderHook(() => useAgenticChatStream())

  await act(async () => {
    const promise = result.current.createCompletion(props)
    onMessageCb(finalMessage)
    await promise
  })

  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(RESOURCE_ERROR_TO_DISPLAY[ErrorCode.invalidResponse])
  expect(props.onCompletionCreation).not.toHaveBeenCalled()
  expect(props.onFinal).toHaveBeenCalled()
  expect(mockClose).toHaveBeenCalled()
})

test('handles error correctly and closes stream in case if completion creation failed with known error', async () => {
  const errorCode = ErrorCode.inactiveAgentVendor
  const { result } = renderHook(() => useAgenticChatStream())

  await act(async () => {
    const promise = result.current.createCompletion(props)
    onErrorCb({ code: errorCode })
    await promise
  })

  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(RESOURCE_ERROR_TO_DISPLAY[errorCode])
  expect(props.onFinal).toHaveBeenCalled()
  expect(props.onCompletionCreation).not.toHaveBeenCalled()
  expect(mockClose).toHaveBeenCalled()
})

test('handles error correctly and closes stream in case if completion creation failed with unknown error', async () => {
  const { result } = renderHook(() => useAgenticChatStream())

  await act(async () => {
    const promise = result.current.createCompletion(props)
    onErrorCb({ code: 'testCode' })
    await promise
  })

  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
  expect(props.onFinal).toHaveBeenCalled()
  expect(props.onCompletionCreation).not.toHaveBeenCalled()
  expect(mockClose).toHaveBeenCalled()
})

test('handles message correctly and closes stream if message with type "Error" received and contains error as text', async () => {
  const { result } = renderHook(() => useAgenticChatStream())

  await act(async () => {
    const promise = result.current.createCompletion(props)
    onMessageCb(errorMessage)
    await promise
  })

  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(errorMessage.text)
  expect(props.onCompletionCreation).not.toHaveBeenCalled()
  expect(props.onFinal).toHaveBeenCalled()
  expect(mockClose).toHaveBeenCalled()
})

test('handles message correctly and closes stream if message with type "Error" contains error as object', async () => {
  const errorCode = ErrorCode.inactiveAgentVendor

  const errorMessage = {
    type: 'Error',
    text: {
      code: errorCode,
      message: 'Error message',
    },
  }

  const { result } = renderHook(() => useAgenticChatStream())

  await act(async () => {
    const promise = result.current.createCompletion(props)
    onMessageCb(errorMessage)
    await promise
  })

  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(RESOURCE_ERROR_TO_DISPLAY[errorCode])
  expect(props.onFinal).toHaveBeenCalled()
  expect(props.onCompletionCreation).not.toHaveBeenCalled()
  expect(mockClose).toHaveBeenCalled()
})

test('creates event source for completion editing with correct arguments', async () => {
  const { result } = renderHook(() => useAgenticChatStream())

  const editingURL = apiMap.apiGatewayV2.v5.agenticAi.conversations.conversation.completions.completion.editQuestion({
    conversationId: editProps.conversationId,
    completionId: editProps.completionId,
    userQuestion: editProps.userQuestion,
    chatArguments: editProps.chatArguments,
  })

  await act(async () => {
    const promise = result.current.editCompletion(editProps)
    onMessageCb(finalMessage)
    await promise
  })

  expect(createAuthenticatedEventSource).nthCalledWith(
    1,
    {
      url: editingURL,
      method: RequestMethod.PATCH,
      onMessage: expect.any(Function),
      onError: expect.any(Function),
    })
})

test('handles successful messages while completion editing', async () => {
  const { result } = renderHook(() => useAgenticChatStream())

  await act(async () => {
    const promise = result.current.editCompletion(editProps)
    onMessageCb(finalMessage)
    await promise
  })

  expect(editProps.onFinal).toHaveBeenCalled()
})

test('handles error correctly and closes stream in case if completion editing failed with known error', async () => {
  const errorCode = ErrorCode.inactiveAgentVendor
  const { result } = renderHook(() => useAgenticChatStream())

  await act(async () => {
    const promise = result.current.editCompletion(editProps)
    onErrorCb({ code: errorCode })
    await promise
  })

  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(RESOURCE_ERROR_TO_DISPLAY[errorCode])
  expect(editProps.onFinal).toHaveBeenCalled()
  expect(mockClose).toHaveBeenCalled()
})

test('handles error correctly and closes stream in case if completion editing failed with unknown error', async () => {
  const { result } = renderHook(() => useAgenticChatStream())

  await act(async () => {
    const promise = result.current.editCompletion(editProps)
    onErrorCb({ code: 'testCode' })
    await promise
  })

  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
  expect(editProps.onFinal).toHaveBeenCalled()
  expect(mockClose).toHaveBeenCalled()
})
