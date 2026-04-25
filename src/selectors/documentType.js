
import get from 'lodash/get'

const documentTypeStateSelector = (state) => get(state, 'documentType')

export {
  documentTypeStateSelector,
}
