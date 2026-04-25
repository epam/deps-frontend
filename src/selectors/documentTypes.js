
import get from 'lodash/get'

const documentTypesStateSelector = (state) => get(state, 'documentTypes')

export {
  documentTypesStateSelector,
}
