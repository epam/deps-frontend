
import { rootApi } from '@/apiRTK/rootApi'
import { apiMap } from '@/utils/apiMap'

const AGENTIC_AI_AGENT_VENDORS = 'AGENTIC_AI_AGENT_VENDORS'

const agentVendorsApi = rootApi.injectEndpoints({
  tagTypes: [AGENTIC_AI_AGENT_VENDORS],
  endpoints: (builder) => ({
    fetchAgentVendors: builder.query({
      query: () => apiMap.apiGatewayV2.v5.agenticAi.agentVendors(),
      transformResponse: (response) => response?.agentVendors ?? [],
      providesTags: [AGENTIC_AI_AGENT_VENDORS],
    }),
  }),
})

export const {
  useFetchAgentVendorsQuery,
} = agentVendorsApi
