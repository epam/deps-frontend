
import { useState, useCallback } from 'react'

const useStateRef = () => {
  const [element, setElement] = useState(null)

  const refCallback = useCallback((node) => {
    if (node) {
      setElement(node)
    }
  }, [])

  return [element, refCallback]
}

export {
  useStateRef,
}
