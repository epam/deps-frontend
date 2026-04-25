
import { createAction } from 'redux-actions'
import { createRequestAction } from '@/actions/requests'
import { labelsApi } from '@/api/labelsApi'

const FEATURE_NAME = 'LABELS'

export const storeLabel = createAction(
  `${FEATURE_NAME}/STORE_LABEL`,
)

export const storeLabels = createAction(
  `${FEATURE_NAME}/STORE_LABELS`,
)

export const fetchLabels = createRequestAction(
  'fetchLabels',
  () => async (dispatch) => {
    const { labels } = await labelsApi.getLabels()
    dispatch(storeLabels(labels))
  },
)

export const createLabel = createRequestAction(
  'createLabel',
  (label) => async (dispatch) => {
    const newLabel = await labelsApi.createLabel(label)
    dispatch(storeLabel(newLabel))
    return newLabel
  },
)
