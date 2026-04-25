
import axios from 'axios'
import { authenticationProvider } from '@/authentication'
import { RequestHeader } from '@/enums/RequestHeader'
import { RequestMethod } from '@/enums/RequestMethod'
import { ENV } from '@/utils/env'
import { getCSRFToken } from '@/utils/getCSRFToken'

class RequestObserver {
  constructor (id) {
    this.id = id
    this.listeners = []
  }

  addListeners = (successCb, errorCb) => {
    this.listeners.push({
      successCb,
      errorCb,
    })
  }

  fire = (error, data) => {
    if (error) {
      this.listeners.forEach((l) => l.errorCb(error))
      return
    }
    this.listeners.forEach((l) => l.successCb(data))
  }
}

class RequestsManager {
  #heap = []

  #clearHeapById = (requestId) => {
    this.#heap = this.#heap.filter((r) => r.id !== requestId)
  }

  #getById = (requestId) => this.#heap.find((r) => r.id === requestId)

  create = (requestId) => {
    this.#heap.push(new RequestObserver(requestId))
  }

  resolvePrevious = (requestId) => new Promise(
    (resolve, reject) => {
      const request = this.#getById(requestId)
      request.addListeners(
        resolve,
        reject,
      )
    },
  )

  fire = (requestId, data, error) => {
    const request = this.#getById(requestId)
    request.fire(error, data)
    this.#clearHeapById(requestId)
  }

  has = (requestId) => !!this.#getById(requestId)
}

const rManager = new RequestsManager()

class ApiRequest {
  static cancelToken = axios.CancelToken
  static instance = axios.create({
    baseURL: '',
    headers: ApiRequest.defaultHeaders,
    timeout: ENV.REQUEST_TIMEOUT,
  })

  static progressRequest = async (url, data, token, { onSuccess, onError, onProgress }) => {
    const cancelTokenSource = ApiRequest.cancelToken.source()

    try {
      const response = await ApiRequest.instance.request({
        url,
        method: RequestMethod.POST,
        headers: {
          [RequestHeader.X_CSRF_TOKEN]: token,
        },
        data,
        cancelToken: cancelTokenSource.token,
        onUploadProgress: (e) => {
          if (onProgress) {
            e.percent = e.total > 0 ? (e.loaded / e.total) * 100 : 0
            e.cancelToken = cancelTokenSource
            onProgress(e)
          }
        },
      })
      onSuccess && onSuccess(response)
    } catch (e) {
      !(e instanceof axios.Cancel) && onError && onError(e)
    }

    return Promise.resolve(() => cancelTokenSource.cancel())
  }

  static formPost (url, formData, { onSuccess, onError, onProgress }) {
    if (ENV.WTF_CSRF_ENABLED) {
      return getCSRFToken(ApiRequest.instance.get)
        .then((token) => ApiRequest.progressRequest(url, formData, token, {
          onSuccess,
          onError,
          onProgress,
        }))
    }
    return ApiRequest.progressRequest(url, formData, undefined, {
      onSuccess,
      onError,
      onProgress,
    })
  }

  static #getAuthHeaders = () => {
    let authHeaders = {}
    const token = authenticationProvider.getAccessToken()
    if (token) {
      authHeaders = {
        [RequestHeader.AUTHORIZATION]: `Bearer ${token}`,
      }
    }
    return authHeaders
  }

  static #getCSRFHeaders = async (method) => {
    let CSRFHeaders = {}
    if (method !== RequestMethod.GET && ENV.WTF_CSRF_ENABLED) {
      CSRFHeaders = {
        ...CSRFHeaders,
        [RequestHeader.X_CSRF_TOKEN]: await getCSRFToken(ApiRequest.instance.get),
      }
    }
    return CSRFHeaders
  }

  static __init__ () {
    ApiRequest.instance.interceptors.request.use(
      async (config) => {
        const authHeaders = ApiRequest.#getAuthHeaders()
        const CSRFHeaders = await ApiRequest.#getCSRFHeaders(config.method)

        const headers = {
          ...ApiRequest.defaultHeaders,
          ...authHeaders,
          ...CSRFHeaders,
        }

        config.headers = {
          ...headers,
          ...config.headers,
        }

        return config
      },
      (error) => Promise.reject(error),
    )

    ApiRequest.instance.interceptors.response.use(
      (config) => config.data,
    )

    ApiRequest.instance.formPost = ApiRequest.formPost
  }
}

ApiRequest.__init__()

const getProxyHandler = {
  apply: async function (target, _, argumentList) {
    const [requestId] = argumentList
    try {
      if (rManager.has(requestId)) {
        return rManager.resolvePrevious(requestId)
      }
      rManager.create(requestId)

      const res = await target(...argumentList)
      rManager.fire(requestId, res)
      return res
    } catch (e) {
      rManager.fire(requestId, null, e)
      throw e
    }
  },
}

const isRequestCanceled = (e) => (
  axios.isCancel(e)
)

const getProxy = new Proxy(ApiRequest.instance.get, getProxyHandler)

ApiRequest.instance.get = getProxy

const apiRequest = ApiRequest.instance

export {
  apiRequest,
  isRequestCanceled,
}
