
import get from 'lodash/get'

const documentsRootStateSelector = (state) => get(state, 'documents')

export {
  documentsRootStateSelector,
}
