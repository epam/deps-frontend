
import { createAction } from 'redux-actions'
import { POST_SIGN_IN_REDIRECT_URL } from '@/constants/storage'
import {
  RESOURCE_ERROR_TO_DISPLAY,
  ERROR_STATUS_TO_URL_MAPPER,
} from '@/enums/Errors'
import { localize, Localization } from '@/localization/i18n'
import { history } from '@/utils/history'
import { notifyWarning } from '@/utils/notification'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'

const FEATURE_NAME = 'REQUESTS'

export const requestAttempt = createAction(
  `${FEATURE_NAME}/REQUEST_ATTEMPT`,
)

export const requestSuccess = createAction(
  `${FEATURE_NAME}/REQUEST_SUCCESS`,
)

export const requestFailure = createAction(
  `${FEATURE_NAME}/REQUEST_FAILURE`,
  (requestId, error) => ({
    requestId,
    error,
  }),
)

export const createRequestAction = (requestId, actionCreator, errorHandler) => {
  const requestActionCreator = (...args) => async (dispatch, getState) => {
    try {
      dispatch(requestAttempt(requestId))
      const result = await actionCreator(...args)(dispatch, getState)
      dispatch(requestSuccess(requestId))
      return result
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data
        const errorStatus = error.response.status
        if (ERROR_STATUS_TO_URL_MAPPER[errorStatus]) {
          sessionStorageWrapper.setItem(POST_SIGN_IN_REDIRECT_URL, window.location.href)
          history.push(ERROR_STATUS_TO_URL_MAPPER[errorStatus])
        } else if (RESOURCE_ERROR_TO_DISPLAY[errorData.code]) {
          notifyWarning(RESOURCE_ERROR_TO_DISPLAY[errorData.code])
        } else {
          notifyWarning(localize(Localization.DEFAULT_ERROR))
        }
      } else {
        notifyWarning(localize(Localization.DEFAULT_ERROR))
      }
      dispatch(requestFailure(requestId, error.message))
      if (errorHandler) {
        errorHandler(error)
      } else {
        throw (error)
      }
    }
  }

  requestActionCreator.toString = () => requestId
  return requestActionCreator
}
