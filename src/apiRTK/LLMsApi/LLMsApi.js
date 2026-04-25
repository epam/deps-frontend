
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { LLMProvider } from '@/models/LLMProvider'
import { apiMap } from '@/utils/apiMap'

const LLMsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchLLMs: builder.query({
      query: () => apiMap.apiGatewayV2.v5.tools.llms(),
      transformResponse: (response) => LLMProvider.getAvailable(response.providers),
    }),
    retrieveInsights: builder.mutation({
      query: ({ id, ...body }) => ({
        url: apiMap.apiGatewayV2.v5.documents.document.analysis.retrieveInsights(id),
        method: RequestMethod.POST,
        body,
      }),
      transformResponse: (response) => response.elements,
    }),
  }),
})

export const {
  useFetchLLMsQuery,
  useRetrieveInsightsMutation,
} = LLMsApi
