
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'

const mapDataToDTO = (data) => (
  data.map((field) => ({
    ...field,
    name: field.name.trim(),
  }))
)

const defaultTags = ['DocumentSupplementsApi']

export const documentSupplementsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchSupplements: builder.query({
      query: (documentId) => apiMap.apiGatewayV2.v5.documents.document.supplement(documentId),
      transformResponse: (response) => response.data,
      providesTags: defaultTags,
    }),
    createOrUpdateSupplements: builder.mutation({
      query: ({ documentId, documentTypeId, data }) => ({
        url: apiMap.apiGatewayV2.v5.documents.document.supplement(documentId),
        method: RequestMethod.PUT,
        body: {
          documentTypeId,
          data: mapDataToDTO(data),
        },
      }),
      invalidatesTags: defaultTags,
    }),
  }),
})

export const {
  useFetchSupplementsQuery,
  useLazyFetchSupplementsQuery,
  useCreateOrUpdateSupplementsMutation,
} = documentSupplementsApi
