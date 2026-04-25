
import { getFileExtension } from '@/utils/getFileExtension'
import { getExtensionsFromMime } from '@/utils/getMime'

const convertBytesToMegaBytes = (bytes) => bytes / (1024 * 1024)

class ValidationService {
  static isSizeValid (
    maxMbFileSize,
    bytesFileSize,
  ) {
    const fileSizeInMb = convertBytesToMegaBytes(bytesFileSize)
    const isFileSizeValid = fileSizeInMb <= maxMbFileSize

    return isFileSizeValid
  }

  static isFormatValid (
    supportedExtensions,
    mimeType,
    name,
  ) {
    const extensions = getExtensionsFromMime(mimeType)
    const nameExtension = getFileExtension(name)

    if (
      !extensions ||
      extensions?.every((extension) => extension !== nameExtension)
    ) {
      return false
    }

    return (
      extensions.some((e) => supportedExtensions.includes(e))
    )
  }
}

export {
  ValidationService,
}
