
import { useEffect, useState } from 'react'
import { dynamicScriptCache } from './dynamicScriptCache'

const useDynamicScript = (url) => {
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!url || dynamicScriptCache.has(url)) {
      return
    }

    const element = document.createElement('script')

    element.src = url
    element.defer = true

    setReady(false)
    setFailed(false)

    element.onload = () => {
      setReady(true)
      dynamicScriptCache.set(url, element)
    }

    element.onerror = () => {
      setReady(false)
      setFailed(true)
    }

    document.head.appendChild(element)

    return () => {
      document.head.removeChild(element)
    }
  }, [url])

  return {
    ready,
    failed,
  }
}

export {
  useDynamicScript,
}
