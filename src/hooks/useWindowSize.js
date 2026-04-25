
import lodashDebounce from 'lodash/debounce'
import { useEffect, useState } from 'react'

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    zoom: Math.round(window.devicePixelRatio * 100),
  })

  useEffect(() => {
    const handleResize = () => setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: Math.round(window.devicePixelRatio * 100),
    })

    const debouncedResize = lodashDebounce(handleResize, 300)
    window.addEventListener('resize', debouncedResize)
    return () => window.removeEventListener('resize', debouncedResize)
  }, [])

  return windowSize
}

export {
  useWindowSize,
}
