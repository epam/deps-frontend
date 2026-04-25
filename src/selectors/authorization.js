
import get from 'lodash/get'
import { createSelector } from 'reselect'

const authorizationSelector = (state) => state.authorization

const userSelector = createSelector(
  [authorizationSelector],
  (authorization) => get(authorization, 'user'),
)

export {
  userSelector,
}
