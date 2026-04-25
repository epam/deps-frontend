
import get from 'lodash/get'

const labelsSelector = (state) => get(state, 'labels')

export {
  labelsSelector,
}
