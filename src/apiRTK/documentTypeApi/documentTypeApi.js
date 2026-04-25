
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import { DOCUMENT_TYPES } from './sharedTags'

const defaultTags = [DOCUMENT_TYPES]

const documentTypeApi = rootApi.injectEndpoints({
  tagTypes: defaultTags,
  endpoints: (builder) => ({
    deleteDocumentType: builder.mutation({
      query: (id) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType(id),
        method: RequestMethod.DELETE,
      }),
      invalidatesTags: defaultTags,
    }),
    deleteDocumentTypeExtractor: builder.mutation({
      query: ({ documentTypeId, extractorId }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.extractors.extractor(
          documentTypeId,
          extractorId,
        ),
        method: RequestMethod.DELETE,
      }),
      invalidatesTags: defaultTags,
    }),
  }),
})

export const {
  useDeleteDocumentTypeMutation,
  useDeleteDocumentTypeExtractorMutation,
} = documentTypeApi
