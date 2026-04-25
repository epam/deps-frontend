
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'

const DOCUMENT_LAYOUT_TAG = 'DocumentLayout'
const PARAGRAPH_TAG = 'Paragraph'
const IMAGE_TAG = 'Image'
const TABLE_TAG = 'Table'
const KEY_VALUE_PAIR_TAG = 'KeyValuePair'

const defaultTags = [
  DOCUMENT_LAYOUT_TAG,
  PARAGRAPH_TAG,
  IMAGE_TAG,
  TABLE_TAG,
  KEY_VALUE_PAIR_TAG,
]

const documentLayoutApi = rootApi.injectEndpoints({
  tagTypes: defaultTags,
  endpoints: (builder) => ({
    fetchDocumentLayout: builder.query({
      query: ({ documentId, ...parsingParams }) => apiMap.apiGatewayV2.v5.documents.document.documentLayout(documentId, parsingParams),
      providesTags: (result, error, { documentId }) => {
        const tags = [
          {
            type: DOCUMENT_LAYOUT_TAG,
            id: documentId,
          },
        ]
        result?.pages.forEach((page) => {
          page?.paragraphs.forEach((paragraph) => {
            tags.push({
              type: PARAGRAPH_TAG,
              id: paragraph.id,
            })
          })
          page?.images.forEach((image) => {
            tags.push({
              type: IMAGE_TAG,
              id: image.id,
            })
          })
          page?.tables.forEach((table) => {
            tags.push({
              type: TABLE_TAG,
              id: table.id,
            })
          })
          page?.keyValuePairs.forEach((keyValuePair) => {
            tags.push({
              type: KEY_VALUE_PAIR_TAG,
              id: keyValuePair.id,
            })
          })
        })
        return tags
      },
    }),
    fetchParsingInfo: builder.query({
      query: (documentId) => apiMap.apiGatewayV2.v5.documents.document.parsingInfo(documentId),
      providesTags: (result, error, documentId) => [
        {
          type: DOCUMENT_LAYOUT_TAG,
          id: documentId,
        },
      ],
    }),
    createUserDocumentLayout: builder.mutation({
      query: ({ documentId, parsingType }) => ({
        url: apiMap.apiGatewayV2.v5.documents.document.documentLayout.userParsingType(documentId),
        method: RequestMethod.PUT,
        body: {
          parsingType,
        },
      }),
      invalidatesTags: (result, error, { documentId }) => [
        {
          type: DOCUMENT_LAYOUT_TAG,
          id: documentId,
        },
      ],
    }),
    updateParagraph: builder.mutation({
      query: ({ documentId, pageId, paragraphId, body }) => ({
        url: apiMap.apiGatewayV2.v5.documents.document.documentLayout.pages.page.paragraphs.paragraph(
          documentId,
          pageId,
          paragraphId,
        ),
        method: RequestMethod.PATCH,
        body,
      }),
      invalidatesTags: (result, error, { paragraphId }) => [
        {
          type: PARAGRAPH_TAG,
          id: paragraphId,
        },
      ],
    }),
    updateImage: builder.mutation({
      query: ({ documentId, pageId, imageId, body }) => ({
        url: apiMap.apiGatewayV2.v5.documents.document.documentLayout.pages.page.images.image(
          documentId,
          pageId,
          imageId,
        ),
        method: RequestMethod.PATCH,
        body,
      }),
      invalidatesTags: (result, error, { imageId }) => [
        {
          type: IMAGE_TAG,
          id: imageId,
        },
      ],
    }),
    updateTable: builder.mutation({
      query: ({ documentId, pageId, tableId, body }) => ({
        url: apiMap.apiGatewayV2.v5.documents.document.documentLayout.pages.page.tables.table(
          documentId,
          pageId,
          tableId,
        ),
        method: RequestMethod.PATCH,
        body,
      }),
      invalidatesTags: (result, error, { tableId }) => [
        {
          type: TABLE_TAG,
          id: tableId,
        },
      ],
    }),
    updateKeyValuePair: builder.mutation({
      query: ({ documentId, pageId, keyValuePairId, body }) => ({
        url: apiMap.apiGatewayV2.v5.documents.document.documentLayout.pages.page.keyValuePairs.keyValuePair.patch(
          documentId,
          pageId,
          keyValuePairId,
        ),
        method: RequestMethod.PATCH,
        body,
      }),
      invalidatesTags: (result, error, { keyValuePairId }) => [
        {
          type: KEY_VALUE_PAIR_TAG,
          id: keyValuePairId,
        },
      ],
    }),
  }),
})

export const {
  useFetchDocumentLayoutQuery,
  useFetchParsingInfoQuery,
  useCreateUserDocumentLayoutMutation,
  useUpdateParagraphMutation,
  useUpdateImageMutation,
  useUpdateTableMutation,
  useUpdateKeyValuePairMutation,
} = documentLayoutApi

export { documentLayoutApi }
