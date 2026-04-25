import { useEffect } from 'react'

const useResizeObserver = ({ element, onResize }) => {
  useEffect(() => {
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        onResize(entries[0].contentRect)
      }
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [onResize, element])
}

export {
  useResizeObserver,
}
