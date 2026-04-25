
import { useCallback, useState } from 'react'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { RequestMethod } from '@/enums/RequestMethod'
import { Localization, localize } from '@/localization/i18n'
import { apiMap } from '@/utils/apiMap'
import { jsonTryParse } from '@/utils/jsonTryParse'
import { notifyWarning } from '@/utils/notification'
import { createAuthenticatedEventSource } from '../utils/messageEventSource'

const ANSWER_TYPES = {
  FINAL: 'Final',
  ERROR: 'Error',
}

const EVENT_ERROR = 'eventError'

const useAgenticChatStream = () => {
  const [isCompletionProcessing, setIsCompletionProcessing] = useState(false)

  const handleMessage = ({
    data,
    eventSource,
    resolve,
    reject,
  }) => {
    const parsedData = jsonTryParse(data)

    if (!parsedData) {
      eventSource.close()
      const error = new Error(RESOURCE_ERROR_TO_DISPLAY[ErrorCode.invalidResponse])
      error.code = ErrorCode.invalidResponse
      return reject(error)
    }

    if (parsedData.type === ANSWER_TYPES.ERROR) {
      eventSource.close()
      const errorData = jsonTryParse(parsedData.text)
      const error = new Error(errorData?.message || parsedData.text)
      error.code = errorData?.code || EVENT_ERROR
      return reject(error)
    }

    if (parsedData.type === ANSWER_TYPES.FINAL) {
      eventSource.close()
      resolve()
    }
  }

  const createCompletionRequest = useCallback(({
    conversationId,
    userQuestion,
    chatArguments,
  }) => new Promise((resolve, reject) => {
    const eventSource = createAuthenticatedEventSource({
      url: apiMap.apiGatewayV2.v5.agenticAi.conversations.conversation.chat({
        conversationId,
        userQuestion,
        chatArguments,
      }),
      onError: (err) => {
        eventSource.close()
        reject(err)
      },
      onMessage: (data) => handleMessage({
        data,
        eventSource,
        resolve,
        reject,
      }),
    })
  }), [])

  const editCompletionRequest = useCallback(({
    conversationId,
    completionId,
    userQuestion,
    chatArguments,
  }) => new Promise((resolve, reject) => {
    const eventSource = createAuthenticatedEventSource({
      url: apiMap.apiGatewayV2.v5.agenticAi.conversations.conversation.completions.completion.editQuestion({
        conversationId,
        completionId,
        userQuestion,
        chatArguments,
      }),
      method: RequestMethod.PATCH,
      onError: (err) => {
        eventSource.close()
        reject(err)
      },
      onMessage: (data) => {
        handleMessage({
          data,
          eventSource,
          resolve,
          reject,
        })
      },
    })
  }), [])

  const createCompletion = useCallback(async ({
    conversationId,
    userQuestion,
    chatArguments,
    onCompletionCreation,
    onFinal,
  }) => {
    try {
      setIsCompletionProcessing(true)
      await createCompletionRequest({
        conversationId,
        userQuestion,
        chatArguments,
      })
      await onCompletionCreation()
    } catch (error) {
      const errorCode = error.code
      const message = (errorCode === EVENT_ERROR) ? error.message : RESOURCE_ERROR_TO_DISPLAY[errorCode]
      notifyWarning(message || localize(Localization.DEFAULT_ERROR))
    } finally {
      await onFinal?.()
      setIsCompletionProcessing(false)
    }
  }, [createCompletionRequest, setIsCompletionProcessing])

  const editCompletion = useCallback(async ({
    conversationId,
    completionId,
    userQuestion,
    chatArguments,
    onFinal,
  }) => {
    try {
      setIsCompletionProcessing(true)
      await editCompletionRequest({
        conversationId,
        completionId,
        userQuestion,
        chatArguments,
      })
    } catch (error) {
      const errorCode = error.code
      const message = (errorCode === EVENT_ERROR) ? error.message : RESOURCE_ERROR_TO_DISPLAY[errorCode]
      notifyWarning(message || localize(Localization.DEFAULT_ERROR))
    } finally {
      await onFinal?.()
      setIsCompletionProcessing(false)
    }
  }, [editCompletionRequest, setIsCompletionProcessing])

  return {
    createCompletion,
    editCompletion,
    isCompletionProcessing,
  }
}

export {
  useAgenticChatStream,
}
