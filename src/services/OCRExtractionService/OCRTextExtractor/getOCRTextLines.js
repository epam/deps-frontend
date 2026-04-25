
import { documentsApi } from '@/api/documentsApi'
import { OCRGridCache } from './OCRGridCache'

export const getHash = (...rest) => rest.join('hash')

export const getOCRTextLines = async (language, engine, blobName) => {
  const hash = getHash(language, engine, blobName)

  if (OCRGridCache.has(hash)) {
    return OCRGridCache.get(hash)
  }

  const { textLines } = await documentsApi.extractImagePage({
    language,
    engine,
    blobName,
  })

  OCRGridCache.set(hash, textLines)

  return textLines
}
