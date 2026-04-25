
import axios from 'axios'
import debounce from 'lodash/debounce'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { usePrevious } from '@/hooks/usePrevious'
import { FileCache } from '@/services/FileCache/index.mjs'
import { loadImageURL } from '@/utils/image'

const DEBOUNCE_TIME = 500

const useImageLoader = (imageUrl, shouldCache) => {
  const cancelTokenSourceRef = useRef()
  const prevImageUrl = usePrevious(imageUrl)
  const currentRequestIdRef = useRef(0)

  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState({
    height: 0,
    width: 0,
  })

  const getImageUrl = useCallback(async (url) => {
    if (!shouldCache) {
      return url
    }

    let cachedBlob = await FileCache.get(url)

    if (!cachedBlob) {
      const cachedData = await FileCache.requestAndStore([url])
      cachedBlob = cachedData[url]
    }

    return cachedBlob ? URL.createObjectURL(cachedBlob) : url
  }, [shouldCache])

  const loadImage = useCallback(async () => {
    cancelTokenSourceRef.current?.cancel()
    cancelTokenSourceRef.current = axios.CancelToken.source()

    const requestId = ++currentRequestIdRef.current
    setIsLoading(true)

    try {
      const url = await getImageUrl(imageUrl)
      const image = await loadImageURL(url, cancelTokenSourceRef.current)
      setImage(() => ({
        width: image.width,
        height: image.height,
        resource: image,
      }))
    } finally {
      if (requestId === currentRequestIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [getImageUrl, imageUrl])

  const debouncedLoadImage = useMemo(
    () => debounce(loadImage, DEBOUNCE_TIME),
    [loadImage],
  )

  useEffect(() => {
    const isFirstLoad = !prevImageUrl
    const isNewImage = prevImageUrl !== imageUrl

    if (isFirstLoad) {
      loadImage()
      return
    }

    if (isNewImage) {
      debouncedLoadImage()
    }
  }, [
    debouncedLoadImage,
    imageUrl,
    loadImage,
    prevImageUrl,
  ])

  return {
    image,
    isLoading,
  }
}

export {
  useImageLoader,
}
