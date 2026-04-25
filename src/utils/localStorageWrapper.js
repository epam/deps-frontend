
export const localStorageWrapper = {
  getItem (key) {
    try {
      const data = window.localStorage.getItem(key)
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  setItem (key, data) {
    window.localStorage.setItem(key, JSON.stringify(data))
  },
}
