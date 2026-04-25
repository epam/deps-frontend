
import get from 'lodash/get'

const languagesSelector = (state) => get(state, 'languages')

export {
  languagesSelector,
}
