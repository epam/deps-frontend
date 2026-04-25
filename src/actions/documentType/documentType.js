
import { createAction } from 'redux-actions'
import { createRequestAction } from '@/actions/requests'
import { documentTypesApi } from '@/api/documentTypesApi'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { ENV } from '@/utils/env'

const FEATURE_NAME = 'DOCUMENT_TYPE'

const storeDocumentType = createAction(
  `${FEATURE_NAME}/STORE_DOCUMENT_TYPE`,
)

const clearDocumentTypeStore = createAction(
  `${FEATURE_NAME}/CLEAR_DOCUMENT_TYPE_STORE`,
)

const allDocumentTypeExtras = [
  DocumentTypeExtras.EXTRACTION_FIELDS,
  DocumentTypeExtras.VALIDATORS,
  ...(ENV.FEATURE_ENRICHMENT ? [DocumentTypeExtras.EXTRA_FIELDS] : []),
  ...(ENV.FEATURE_OUTPUT_PROFILES ? [DocumentTypeExtras.PROFILES] : []),
  ...(ENV.FEATURE_LLM_EXTRACTORS ? [DocumentTypeExtras.LLM_EXTRACTORS] : []),
  DocumentTypeExtras.WORKFLOW_CONFIGURATIONS,
]

const ARRAY_EXTRAS = new Set([
  DocumentTypeExtras.EXTRACTION_FIELDS,
  DocumentTypeExtras.VALIDATORS,
  DocumentTypeExtras.EXTRA_FIELDS,
  DocumentTypeExtras.PROFILES,
  DocumentTypeExtras.LLM_EXTRACTORS,
])

const fetchDocumentType = createRequestAction(
  'fetchDocumentType',
  (documentTypeCode, extras) => async (dispatch, getState) => {
    const currentDocumentType = documentTypeStateSelector(getState()) || {}
    const fetchedDocumentType = await documentTypesApi.fetchDocumentType(documentTypeCode, extras)

    const mergedExtras = Object.fromEntries(
      allDocumentTypeExtras.map((extra) => {
        const emptyFallback = ARRAY_EXTRAS.has(extra) ? [] : null
        const currentExtraValue = currentDocumentType[extra] ?? emptyFallback

        return [
          extra,
          extras?.includes(extra) ? fetchedDocumentType[extra] : currentExtraValue,
        ]
      }),
    )

    dispatch(storeDocumentType({
      ...fetchedDocumentType,
      ...mergedExtras,
    }))
  },
)

export {
  fetchDocumentType,
  storeDocumentType,
  clearDocumentTypeStore,
}
