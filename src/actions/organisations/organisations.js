
import { createAction } from 'redux-actions'
import { storeUser } from '@/actions/authorization'
import { createRequestAction } from '@/actions/requests'
import { iamApi } from '@/api/iamApi'
import { organisationsSelector } from '@/selectors/organisations'

const FEATURE_NAME = 'ORGANISATIONS'

const storeOrganisations = createAction(
  `${FEATURE_NAME}/STORE_ORGANISATIONS`,
)

const fetchOrganisations = createRequestAction(
  'fetchOrganisations',
  () => async (dispatch) => {
    const { organisations } = await iamApi.getOrganisations()
    dispatch(storeOrganisations(organisations))
  },
)

const changeOrgName = createRequestAction(
  'changeOrgName',
  (orgPk, newName) => async (dispatch, getState) => {
    const newOrganisation = await iamApi.updateOrganisation(orgPk, newName)
    const state = getState()
    const organisations = organisationsSelector(state)
      .map((org) => org.pk === orgPk ? newOrganisation : org)
    const user = {
      ...state.authorization.user,
      organisation: newOrganisation,
    }
    dispatch(storeOrganisations(organisations))
    dispatch(storeUser(user))
  },
)

export {
  storeOrganisations,
  changeOrgName,
  fetchOrganisations,
}
