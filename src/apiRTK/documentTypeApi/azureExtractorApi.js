
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import { DOCUMENT_TYPES, AZURE_EXTRACTOR } from './sharedTags'

const defaultTags = [DOCUMENT_TYPES, AZURE_EXTRACTOR]

const documentTypeApi = rootApi.injectEndpoints({
  tagTypes: defaultTags,
  endpoints: (builder) => ({
    createAzureExtractor: builder.mutation({
      query: (documentTypeData) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.azureExtractor(),
        method: RequestMethod.POST,
        body: documentTypeData,
      }),
      invalidatesTags: defaultTags,
    }),
    validateAzureExtractorCredentials: builder.mutation({
      query: (body) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.azureExtractor.validateCredentials(),
        method: RequestMethod.POST,
        body,
      }),
    }),
    fetchAzureExtractor: builder.query({
      query: (documentTypeId) => apiMap.apiGatewayV2.v5.documentTypes.azureExtractor.extractor(documentTypeId),
      providesTags: [AZURE_EXTRACTOR],
    }),
    updateAzureExtractor: builder.mutation({
      query: ({ documentTypeId, credentials }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.azureExtractor.extractor(documentTypeId),
        method: RequestMethod.PUT,
        body: credentials,
      }),
      invalidatesTags: defaultTags,
    }),
    checkAzureExtractor: builder.query({
      query: (documentTypeId) => apiMap.apiGatewayV2.v5.documentTypes.azureExtractor.extractor.checkup(documentTypeId),
      providesTags: [AZURE_EXTRACTOR],
    }),
    synchronizeAzureExtractor: builder.mutation({
      query: ({ documentTypeId }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.azureExtractor.extractor.synchronize(documentTypeId),
        method: RequestMethod.PUT,
      }),
      invalidatesTags: defaultTags,
    }),
  }),
})

export const {
  useCreateAzureExtractorMutation,
  useValidateAzureExtractorCredentialsMutation,
  useFetchAzureExtractorQuery,
  useUpdateAzureExtractorMutation,
  useCheckAzureExtractorQuery,
  useSynchronizeAzureExtractorMutation,
} = documentTypeApi
