
import { useEffect } from 'react'

const useMutationObserver = (element, handler) => {
  useEffect(() => {
    if (!element) {
      return
    }

    const observer = new MutationObserver(handler)

    observer.observe(element, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [element, handler])
}

export {
  useMutationObserver,
}
