
import { FileExtension } from '@/enums/FileExtension'
import { MimeType } from '@/enums/MimeType'

const MIME_TO_EXTENSION = {
  [MimeType.IMAGE_JPEG]: [FileExtension.JPG, FileExtension.JPEG],
  [MimeType.IMAGE_PNG]: [FileExtension.PNG],
  [MimeType.APPLICATION_PDF]: [FileExtension.PDF],
  [MimeType.MAIL_EML]: [FileExtension.EML],
  [MimeType.IMAGE_TIFF]: [FileExtension.TIFF, FileExtension.TIF],
  [MimeType.APPLICATION_MICROSOFT_DOCUMENT]: [
    FileExtension.DOCX,
    FileExtension.XLSX,
    FileExtension.XLS,
    FileExtension.XLSM,
    FileExtension.XLTX,
    FileExtension.XLTM,
    FileExtension.MSG,
  ],
  [MimeType.APPLICATION_CSV]: [FileExtension.CSV],
  [MimeType.APPLICATION_XLS]: [FileExtension.XLS],
  [MimeType.APPLICATION_MICROSOFT_EXCEL_OPEN_XML]: [FileExtension.XLSX],
  [MimeType.APPLICATION_JSON]: [FileExtension.JSON],
}

const mapHeaderToMime = (header) => {
  switch (header) {
    case '89504e47':
      return MimeType.IMAGE_PNG
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
    case 'ffd8ffdb':
      return MimeType.IMAGE_JPEG
    case '25504446':
      return MimeType.APPLICATION_PDF
    case '44656c69':
    case '55736572':
    case '52657475':
    case '52656365':
    case '46726f6d':
      return MimeType.MAIL_EML
    case 'd0cf11e0':
    case '44617465':
    case '504b34':
      return MimeType.APPLICATION_MICROSOFT_DOCUMENT
    case '49492a0':
    case '4d4d002':
      return MimeType.IMAGE_TIFF
    default:
      return null
  }
}

const getHeader = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.onloadend = (e) => {
      const arr = (new Uint8Array(e.target.result)).subarray(0, 4)
      let header = ''
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16)
      }

      resolve(header)
    }

    fileReader.onerror = reject
    fileReader.readAsArrayBuffer(file)
  })
}

const getMime = async (file) => {
  try {
    return mapHeaderToMime(await getHeader(file))
  } catch (e) {
    return null
  }
}

const getExtensionsFromMime = (mimeType) => MIME_TO_EXTENSION[mimeType]

export {
  getMime,
  getExtensionsFromMime,
}
