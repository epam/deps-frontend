
import { handleActions } from 'redux-actions'
import { storeDocumentType } from '@/actions/documentType'
import { changeActiveTab } from '@/actions/documentTypePage'

const initialState = {
  id: null,
  activeTab: null,
}

const documentTypePageReducer = handleActions(
  new Map([
    [
      changeActiveTab,
      (state, { payload: activeTab }) => ({
        ...state,
        activeTab,
      }),
    ],
    [
      storeDocumentType,
      (state, { payload: documentType }) => {
        const documentTypeCode = documentType.code

        return {
          ...state,
          id: documentTypeCode,
        }
      },
    ],
  ]),
  initialState,
)

export {
  documentTypePageReducer,
  initialState,
}
