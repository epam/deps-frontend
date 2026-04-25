
import memoize from 'lodash/memoize'
import { ResponseType } from '@/enums/ResponseType'
import { apiRequest } from '@/utils/apiRequest'

function isDataURL (str) {
  if (str === null) {
    return false
  }

  const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@/?%\s]*\s*$/i
  return !!str.match(regex)
}

const loadImageURL = async (url, cancel) => {
  const cancelToken = cancel?.token
  const srcRequest = isDataURL(url) ? Promise.resolve(url) : apiRequest.get(url, {
    responseType: ResponseType.BLOB,
    ...(cancelToken && { cancelToken }),
  }).then(URL.createObjectURL)
  const src = await srcRequest
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

const fetchImage = async (imageUrl) => {
  const blob = await apiRequest.get(imageUrl, {
    responseType: ResponseType.BLOB,
  })
  return URL.createObjectURL(blob)
}

const skipExceptionsMemoization = (fn) => async (...arg) => {
  try {
    return await fn(...arg)
  } catch (e) {
    fn.cache.delete(...arg)
    throw e
  }
}

const memoizedLoadImageURL = skipExceptionsMemoization(memoize(loadImageURL))

export {
  fetchImage,
  memoizedLoadImageURL as loadImageURL,
}
