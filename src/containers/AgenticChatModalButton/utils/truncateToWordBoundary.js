
const DEFAULT_MAX_LENGTH = 100

const truncateToWordBoundary = (text, maxLength = DEFAULT_MAX_LENGTH) => {
  if (text.length <= maxLength) return text.trim()

  const truncated = text.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  const result = lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) : truncated
  return result.trim()
}

export {
  truncateToWordBoundary,
}
