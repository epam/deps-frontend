
import { handleActions } from 'redux-actions'
import { storeDocumentType } from '@/actions/documentType'
import { storeDocumentTypes } from '@/actions/documentTypes'

const initialState = {
  ids: [],
}

const documentTypesListPageReducer = handleActions(
  new Map([
    [
      storeDocumentTypes,
      (state, { payload: documentTypes }) => ({
        ...state,
        ids: documentTypes.map((type) => type.code),
      }),
    ],
    [
      storeDocumentType,
      (state, { payload: documentType }) => {
        const documentTypeCode = documentType.code

        return {
          ...state,
          ids: state.ids.includes(documentTypeCode)
            ? state.ids
            : [...state.ids, documentTypeCode],
        }
      },
    ],
  ]),
  initialState,
)

export {
  documentTypesListPageReducer,
  initialState,
}
