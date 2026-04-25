
import get from 'lodash/get'
import { createSelector } from 'reselect'
import { queryStringToSearchParams } from '@/utils/queryString'

const routerRootStateSelector = (state) => get(state, 'router')

const locationSelector = createSelector(
  [routerRootStateSelector],
  (router) => get(router, 'location'),
)

const searchSelector = createSelector(
  [locationSelector],
  (location) => get(location, 'search'),
)

const searchParamsSelector = createSelector(
  [searchSelector],
  (search) => queryStringToSearchParams(search),
)

const pathNameSelector = createSelector(
  [locationSelector],
  (location) => get(location, 'pathname'),
)

export {
  searchSelector,
  searchParamsSelector,
  pathNameSelector,
}
