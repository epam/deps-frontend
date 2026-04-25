
import get from 'lodash/get'

const documentNavigationInfoSelector = (state) => get(state, 'documentNavigationInfo')

export {
  documentNavigationInfoSelector,
}
