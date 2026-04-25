
import { createAction } from 'redux-actions'
import { createRequestAction } from '@/actions/requests'
import { languagesApi } from '@/api/languagesApi'

const FEATURE_NAME = 'LANGUAGES'

const storeLanguages = createAction(
  `${FEATURE_NAME}/STORE`,
)

const fetchAvailableLanguages = createRequestAction(
  'fetchAvailableLanguages',
  () => async (dispatch) => {
    const { languages } = await languagesApi.getAvailableLanguages()
    dispatch(storeLanguages(languages))
  },
)

export {
  fetchAvailableLanguages,
  storeLanguages,
}
