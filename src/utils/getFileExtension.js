
const getFileExtension = (url) => {
  const splitUrl = url.split('.')

  if (splitUrl.length === 1) {
    return ''
  }

  return `.${splitUrl.pop()}`.toLowerCase()
}

export { getFileExtension }
