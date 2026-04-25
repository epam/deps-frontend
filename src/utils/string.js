
const replaceAll = (str, ...args) => args.reduce((acc, arg, index) => acc.split(`{${index}}`).join(arg), str)

const stringsSorter = (a, b) => {
  a = (a || '').toLowerCase()
  b = (b || '').toLowerCase()

  if (a === b) {
    return 0
  }

  if (a < b) {
    return -1
  }

  return 1
}

const maskExcessChars = (
  charLimit = 0,
  value,
  maskSymbol = '*',
) => {
  if (charLimit > value.length) {
    return value
  }

  const hiddenPart = maskSymbol.repeat(value.length - charLimit)

  return value.slice(0, charLimit) + hiddenPart
}

const getUrlWithOrigin = (url) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const origin = window.location.origin

  if (url.startsWith('/')) {
    return `${origin}${url}`
  }

  return `${origin}/${url}`
}

export {
  getUrlWithOrigin,
  replaceAll,
  stringsSorter,
  maskExcessChars,
}
