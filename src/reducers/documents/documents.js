
import { handleActions } from 'redux-actions'
import {
  storeComment,
  storeDocuments,
  storeDocument,
  storeFields,
  setDataByProp,
  setStatesToDocuments,
  updateExtractedData,
  storeValidation,
  setInitialDocumentData,
  updateExtractedDataChunk,
  updateUnifiedDataTables,
} from '@/actions/documents'

export const initialState = {}

const documentsReducer = handleActions(
  new Map([
    [
      storeDocuments,
      (state, { payload: documents }) => {
        const updatedEntities = { ...state }

        documents.forEach((document) => {
          updatedEntities[document._id] = {
            ...state[document._id],
            ...document,
          }
        })

        return updatedEntities
      },
    ],
    [
      storeDocument,
      (state, { payload: document }) => {
        const documentId = document._id

        return {
          ...state,
          [documentId]: {
            ...state[documentId],
            ...document,
          },
        }
      },
    ],
    [
      updateExtractedData,
      (state, { payload: { documentId, extractedData } = {} }) => {
        let document = state[documentId]

        document = {
          ...document,
          extractedData,
        }

        return {
          ...state,
          [documentId]: document,
        }
      },
    ],
    [
      updateExtractedDataChunk,
      (state, { payload: { documentId, fieldPk, extractedDataChunk } = {} }) => {
        let document = state[documentId]
        document = {
          ...document,
          extractedData: document.extractedData.map((ed) => {
            if (ed.fieldPk !== fieldPk) {
              return ed
            }

            if (extractedDataChunk.meta.listIndex !== null) {
              return {
                ...ed,
                data: ed.data.map((edData) => {
                  if (edData.meta.listIndex === extractedDataChunk.meta.listIndex) {
                    return {
                      ...edData,
                      meta: extractedDataChunk.meta,
                      cells: extractedDataChunk.data.cells,
                    }
                  }
                  return edData
                }),
              }
            }
            return {
              ...ed,
              data: {
                ...ed.data,
                meta: extractedDataChunk.meta,
                cells: extractedDataChunk.data.cells,
              },
            }
          }),
        }

        return {
          ...state,
          [documentId]: document,
        }
      },
    ],
    [
      storeComment,
      (state, { payload: { documentId, comment } }) => {
        let document = state[documentId]

        document = {
          ...document,
          communication: {
            ...document.communication,
            comments: [
              ...document.communication.comments,
              comment,
            ],
          },
        }

        return {
          ...state,
          [documentId]: document,
        }
      },
    ],
    [
      storeValidation,
      (state, { payload: { documentId, validation } }) => {
        const document = {
          ...state[documentId],
          validation,
        }
        return {
          ...state,
          [documentId]: document,
        }
      },
    ],
    [
      storeFields,
      // eslint-disable-next-line no-unused-vars
      (state, { payload: { documentId, fields } }) => {
        const document = { ...state[documentId] }

        return {
          ...state,
          [documentId]: document,
        }
      },
    ],
    [
      setDataByProp,
      (state, { payload: { documentId, prop, data } }) => {
        const document = {
          ...state[documentId],
          [prop]: data,
        }

        return {
          ...state,
          [documentId]: document,
        }
      },
    ],
    [
      setStatesToDocuments,
      (state, { payload: documents }) => {
        const newDocs = { ...state }

        documents.forEach((d) => {
          const document = {
            ...state[d._id],
            state: d.state,
          }
          newDocs[d._id] = document
        })

        return newDocs
      },
    ],
    [
      setInitialDocumentData,
      (state, { payload }) => (
        {
          ...state,
          [payload._id]: {
            ...state[payload._id],
            initialDocumentData: payload,
          },
        }
      ),
    ],
    [
      updateUnifiedDataTables,
      (state, { payload: { documentId, tablesData } }) => tablesData.reduce((acc,
        {
          tableId, cells,
        },
      ) => {
        const { page } = Object.values(acc[documentId].unifiedData).flat().find((ud) => ud.id === tableId)
        const pageUnifiedData = acc[documentId].unifiedData[page]

        const updatedPageUnifiedData = pageUnifiedData.map((ud) => {
          if (ud.id !== tableId) {
            return ud
          }

          return {
            ...ud,
            cells,
          }
        })

        return {
          ...acc,
          [documentId]: {
            ...acc[documentId],
            unifiedData: {
              ...acc[documentId].unifiedData,
              [page]: updatedPageUnifiedData,
            },
          },
        }
      }, state),
    ],
  ]),
  initialState,
)

export {
  documentsReducer,
}
