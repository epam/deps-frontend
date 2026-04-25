
import { createAction } from 'redux-actions'
import { createRequestAction } from '@/actions/requests'
import {
  createGenAiField,
  deleteGenAiFields,
  getGenAiFields,
  updateGenAiField,
} from '@/api/prompterApi'
import { idSelector } from '@/selectors/documentReviewPage'

export const FEATURE_NAME = 'GEN_AI_DATA'

export const storeFields = createAction(
  `${FEATURE_NAME}/STORE_FIELDS`,
)

export const fetchGenAiFields = createRequestAction(
  'fetchGenAiFields',
  () => async (dispatch, getState) => {
    const documentId = idSelector(getState())
    const fields = await getGenAiFields(documentId)

    dispatch(storeFields({
      documentId,
      fields: fields.keyValues,
    }))
  },
)

export const createField = createRequestAction(
  'createdGenAiField',
  (data) => async (dispatch, getState) => {
    const documentId = idSelector(getState())
    await createGenAiField(documentId, data)

    dispatch(fetchGenAiFields())
  },
)

export const updateField = createRequestAction(
  'updateGenAiField',
  (fieldData) => async (dispatch, getState) => {
    const documentId = idSelector(getState())
    await updateGenAiField(documentId, fieldData)

    dispatch(fetchGenAiFields())
  },
)

export const deleteFields = createRequestAction(
  'deleteGenAiFields',
  (ids) => async (dispatch, getState) => {
    const documentId = idSelector(getState())
    await deleteGenAiFields(documentId, { ids })

    dispatch(fetchGenAiFields())
  },
)
