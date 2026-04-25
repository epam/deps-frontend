
export const jsonTryParse = (jsonStr) => {
  try {
    return JSON.parse(jsonStr)
  } catch {
    return null
  }
}
