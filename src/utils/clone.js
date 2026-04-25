
import cloneDeep from 'lodash/cloneDeep'

export const clone = (entity) => {
  if (window && typeof window.structuredClone === 'function') {
    return window.structuredClone(entity)
  }

  return cloneDeep(entity)
}
