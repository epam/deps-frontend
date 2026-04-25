
export const getCurrentFilesCount = (splittedFiles, totalFiles) => (
  splittedFiles.reduce((acc, file) => {
    if (file.segments.length > 1) {
      return acc + file.segments.length - 1
    }

    return acc
  }, totalFiles)
)

export const areFilesEqual = (oldFiles, newFiles) => {
  const newFilesIds = newFiles.map((file) => file.uid)
  const oldFilesIds = oldFiles.map((file) => file.uid)

  if (newFilesIds.length !== oldFilesIds.length) {
    return false
  }

  return oldFilesIds.every((fileId) => newFilesIds.includes(fileId))
}

export const getTooltipConfig = (title) => ({ title })
