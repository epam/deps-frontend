
import FileSaver from 'file-saver'
import { FileExtension } from '@/enums/FileExtension'

const saveToFile = (filename, encoding, content) => {
  FileSaver.saveAs(
    new File([content], filename, { type: encoding }),
  )
}

const readFile = (accept) => new Promise((resolve) => {
  const i = document.createElement('input')
  i.type = 'file'
  i.style = 'display: none'
  i.accept = accept || ''
  i.onchange = (e) => {
    const file = e.target.files[0]
    const r = new FileReader()
    r.readAsText(file, 'UTF-8')
    r.onload = (re) => {
      resolve(re.target.result)
    }
  }
  i.click()
})

const readFileData = (file) => new Promise((resolve) => {
  const reader = new FileReader()
  reader.readAsText(file, 'UTF-8')
  reader.onload = (re) => {
    resolve(re.target.result)
  }
})

const SIZE_UNITS = [
  'B',
  'KB',
  'MB',
]

const DEFAULT_DOWNLOAD_FILE_NAME = 'download'

const getFileSizeStr = (fileSize, unitIndex = 0) => {
  if (fileSize < 1024) {
    const value = unitIndex === 2 ? Math.round(fileSize * 100) / 100 : Math.floor(fileSize)
    const unit = SIZE_UNITS[unitIndex]
    return `${value} ${unit}`
  }

  return getFileSizeStr(fileSize / 1024, unitIndex + 1)
}

const getExtension = (fileName = '') => Object.values(FileExtension).find(
  (ext) => fileName.toLowerCase().endsWith(ext),
)

const hasValidExtension = (fileName = '') => Boolean(getExtension(fileName))

const removeFileExtension = (fileName = '') => {
  const extension = getExtension(fileName)
  return extension ? fileName.slice(0, -extension.length) : fileName
}

const getDownloadFileName = ({
  extension,
  title,
  regexp = /^\.+$/,
  fallbackName = DEFAULT_DOWNLOAD_FILE_NAME,
}) => {
  const fileName = regexp.test(title)
    ? fallbackName
    : title

  return hasValidExtension(fileName)
    ? fileName
    : `${fileName}${extension}`
}

export {
  getFileSizeStr,
  getDownloadFileName,
  removeFileExtension,
  saveToFile,
  readFile,
  readFileData,
}
