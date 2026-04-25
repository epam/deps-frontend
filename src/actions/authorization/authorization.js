
import { createAction } from 'redux-actions'
import { createRequestAction } from '@/actions/requests'
import { iamApi } from '@/api/iamApi'

const FEATURE_NAME = 'AUTHORIZATION'

const storeUser = createAction(
  `${FEATURE_NAME}/STORE_USER`,
)

const fetchMe = createRequestAction(
  'fetchMe',
  () => async (dispatch) => {
    const user = await iamApi.getMe()
    dispatch(storeUser(user))
    return user
  },
)

export {
  storeUser,
  fetchMe,
}
