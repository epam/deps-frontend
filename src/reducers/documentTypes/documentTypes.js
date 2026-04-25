
import { handleActions } from 'redux-actions'
import { storeDocumentType } from '@/actions/documentType'
import { storeDocumentTypes } from '@/actions/documentTypes'

export const initialState = {}

const documentTypesReducer = handleActions(
  new Map([
    [
      storeDocumentTypes,
      (state, { payload: documentTypes }) => {
        const updatedEntities = {}

        documentTypes.forEach((type) => {
          updatedEntities[type.code] = {
            ...state[type.code],
            ...documentTypes.find((resType) => resType.code === type.code),
          }
        })

        return updatedEntities
      },
    ],
    [
      storeDocumentType,
      (state, { payload: documentType }) => {
        const documentTypeCode = documentType.code

        return {
          ...state,
          [documentTypeCode]: documentType,
        }
      },
    ],
  ]),
  initialState,
)

export {
  documentTypesReducer,
}
