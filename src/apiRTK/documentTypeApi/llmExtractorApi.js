
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import { DOCUMENT_TYPES, LLM_EXTRACTOR } from './sharedTags'

const defaultTags = [DOCUMENT_TYPES, LLM_EXTRACTOR]

const llmExtractorApi = rootApi.injectEndpoints({
  tagTypes: defaultTags,
  endpoints: (builder) => ({
    createLLMExtractor: builder.mutation({
      query: (data) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.llmExtractor(),
        method: RequestMethod.POST,
        body: data,
      }),
      invalidatesTags: defaultTags,
    }),
    updateLLMExtractor: builder.mutation({
      query: ({ documentTypeId, extractorId, data }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.llmExtractors.extractor(
          documentTypeId,
          extractorId,
        ),
        method: RequestMethod.PUT,
        body: data,
      }),
      invalidatesTags: defaultTags,
    }),
    updateExtractorLLMReference: builder.mutation({
      query: ({ documentTypeId, extractorId, data }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.llmExtractors.extractor.llm(
          documentTypeId,
          extractorId,
        ),
        method: RequestMethod.PUT,
        body: data,
      }),
      invalidatesTags: defaultTags,
    }),
    createLLMExtractorQuery: builder.mutation({
      query: ({ documentTypeId, extractorId, data }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.llmExtractors.extractor.extractionQuery(documentTypeId, extractorId),
        method: RequestMethod.POST,
        body: data,
      }),
      invalidatesTags: defaultTags,
    }),
    moveLLMExtractorQuery: builder.mutation({
      query: ({ documentTypeId, data }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.llmExtractors.moveQueries(documentTypeId),
        method: RequestMethod.POST,
        body: data,
      }),
      invalidatesTags: defaultTags,
    }),
    updateLLMExtractorQuery: builder.mutation({
      query: ({ documentTypeId, extractorId, fieldCode, data }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.llmExtractors.extractor.extractionQuery.field(
          documentTypeId,
          extractorId,
          fieldCode,
        ),
        method: RequestMethod.PATCH,
        body: data,
      }),
      invalidatesTags: defaultTags,
    }),
  }),
})

export const {
  useCreateLLMExtractorMutation,
  useUpdateLLMExtractorMutation,
  useUpdateExtractorLLMReferenceMutation,
  useCreateLLMExtractorQueryMutation,
  useMoveLLMExtractorQueryMutation,
  useUpdateLLMExtractorQueryMutation,
} = llmExtractorApi
