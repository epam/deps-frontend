
import { useEffect, useRef } from 'react'
import { isRequestCanceled } from '@/utils/apiRequest'

const useAbortRequest = () => {
  const controller = useRef(new AbortController())

  useEffect(() => () => controller.current.abort(), [])

  return {
    signal: controller.current.signal,
    isCanceled: isRequestCanceled,
  }
}

export {
  useAbortRequest,
}
