
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'

const AGENTIC_AI_CONVERSATIONS = 'AGENTIC_AI_CONVERSATIONS'
const AGENTIC_AI_CONVERSATION = 'AGENTIC_AI_CONVERSATION'

const defaultTags = [AGENTIC_AI_CONVERSATIONS, AGENTIC_AI_CONVERSATION]

const conversationApi = rootApi.injectEndpoints({
  tagTypes: defaultTags,
  endpoints: (builder) => ({
    fetchConversations: builder.query({
      query: (filters) => apiMap.apiGatewayV2.v5.agenticAi.conversations(filters),
      providesTags: [AGENTIC_AI_CONVERSATIONS],
    }),
    fetchConversation: builder.query({
      query: ({ conversationId }) => (
        apiMap.apiGatewayV2.v5.agenticAi.conversations.conversation(conversationId)
      ),
      providesTags: [AGENTIC_AI_CONVERSATION],
    }),
    createConversation: builder.mutation({
      query: (data) => ({
        url: apiMap.apiGatewayV2.v5.agenticAi.conversations(),
        method: RequestMethod.POST,
        body: data,
      }),
    }),
    updateConversation: builder.mutation({
      query: ({ conversationId, data }) => ({
        url: apiMap.apiGatewayV2.v5.agenticAi.conversations.conversation(conversationId),
        method: RequestMethod.PATCH,
        body: data,
      }),
    }),
    deleteConversation: builder.mutation({
      query: (conversationId) => ({
        url: apiMap.apiGatewayV2.v5.agenticAi.conversations({ id: conversationId }),
        method: RequestMethod.DELETE,
      }),
    }),
  }),
})

export const {
  useFetchConversationsQuery,
  useFetchConversationQuery,
  useLazyFetchConversationQuery,
  useLazyFetchConversationsQuery,
  useCreateConversationMutation,
  useUpdateConversationMutation,
  useDeleteConversationMutation,
} = conversationApi
