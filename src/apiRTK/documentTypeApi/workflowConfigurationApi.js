
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'

const workflowConfigurationApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    updateWorkflowConfiguration: builder.mutation({
      query: ({ documentTypeId, data }) => ({
        url: apiMap.apiGatewayV2.v5.workflowConfiguration(documentTypeId),
        method: RequestMethod.PATCH,
        body: data,
      }),
    }),
  }),
})

export const {
  useUpdateWorkflowConfigurationMutation,
} = workflowConfigurationApi
