
export const sessionStorageWrapper = {
  getItem (item) {
    return sessionStorage.getItem(item)
  },

  setItem (key, item) {
    return sessionStorage.setItem(key, item)
  },

  removeItem (key) {
    return sessionStorage.removeItem(key)
  },
}
