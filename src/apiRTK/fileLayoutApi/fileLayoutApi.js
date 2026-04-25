
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import {
  DEFAULT_TAGS,
  FILE_LAYOUT_TAG,
  PARAGRAPH_TAG,
  IMAGE_TAG,
  TABLE_TAG,
  KEY_VALUE_PAIR_TAG,
  FILE_PARSING_INFO_TAG,
} from './tags'

export const fileLayoutApi = rootApi.injectEndpoints({
  tagTypes: DEFAULT_TAGS,
  endpoints: (builder) => ({
    fetchFileLayout: builder.query({
      query: ({ fileId, ...parsingParams }) => apiMap.apiGatewayV2.v5.files.file.documentLayout(fileId, parsingParams),
      providesTags: (result, error, { fileId }) => {
        const tags = [
          {
            type: FILE_LAYOUT_TAG,
            id: fileId,
          },
        ]
        result?.pages.forEach((page) => {
          page.paragraphs.forEach((paragraph) => {
            tags.push({
              type: PARAGRAPH_TAG,
              id: paragraph.id,
            })
          })
          page.images.forEach((image) => {
            tags.push({
              type: IMAGE_TAG,
              id: image.id,
            })
          })
          page.tables.forEach((table) => {
            tags.push({
              type: TABLE_TAG,
              id: table.id,
            })
          })
          page.keyValuePairs.forEach((keyValuePair) => {
            tags.push({
              type: KEY_VALUE_PAIR_TAG,
              id: keyValuePair.id,
            })
          })
        })
        return tags
      },
    }),
    fetchFileParsingInfo: builder.query({
      query: (fileId) => apiMap.apiGatewayV2.v5.files.file.parsingInfo(fileId),
      providesTags: (result, error, fileId) => [
        {
          type: FILE_PARSING_INFO_TAG,
          id: fileId,
        },
      ],
    }),
    createUserFileLayout: builder.mutation({
      query: ({ fileId, parsingType }) => ({
        url: apiMap.apiGatewayV2.v5.files.file.documentLayout.userParsingType(fileId),
        method: RequestMethod.PUT,
        body: {
          parsingType,
        },
      }),
      invalidatesTags: (result, error, { fileId }) => [
        {
          type: FILE_LAYOUT_TAG,
          id: fileId,
        },
      ],
    }),
    updateFileParagraph: builder.mutation({
      query: ({ fileId, pageId, paragraphId, body }) => ({
        url: apiMap.apiGatewayV2.v5.files.file.documentLayout.pages.page.paragraphs.paragraph(
          fileId,
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
    updateFileImage: builder.mutation({
      query: ({ fileId, pageId, imageId, body }) => ({
        url: apiMap.apiGatewayV2.v5.files.file.documentLayout.pages.page.images.image(
          fileId,
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
    updateFileTable: builder.mutation({
      query: ({ fileId, pageId, tableId, body }) => ({
        url: apiMap.apiGatewayV2.v5.files.file.documentLayout.pages.page.tables.table(
          fileId,
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
    updateFileKeyValuePair: builder.mutation({
      query: ({ fileId, pageId, keyValuePairId, body }) => ({
        url: apiMap.apiGatewayV2.v5.files.file.documentLayout.pages.page.keyValuePairs.keyValuePair(
          fileId,
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
  useFetchFileLayoutQuery,
  useFetchFileParsingInfoQuery,
  useCreateUserFileLayoutMutation,
  useUpdateFileParagraphMutation,
  useUpdateFileImageMutation,
  useUpdateFileTableMutation,
  useUpdateFileKeyValuePairMutation,
} = fileLayoutApi
