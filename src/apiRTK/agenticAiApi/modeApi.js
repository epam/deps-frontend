
import { rootApi } from '@/apiRTK/rootApi'
import { apiMap } from '@/utils/apiMap'

const AGENTIC_AI_MODE = 'AGENTIC_AI_MODE'

const defaultTags = [AGENTIC_AI_MODE]

const modeApi = rootApi.injectEndpoints({
  tagTypes: defaultTags,
  endpoints: (builder) => ({
    fetchMode: builder.query({
      query: ({ code }) => apiMap.agenticAi.v1.modes(code),
      transformResponse: (response) => response?.modes,
    }),
  }),
})

export const {
  useFetchModeQuery,
} = modeApi
