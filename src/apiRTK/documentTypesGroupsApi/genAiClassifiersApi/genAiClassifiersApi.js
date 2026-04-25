
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import { GROUP_TAG } from '../sharedTags'

const defaultTags = ['GenAiClassifiers']

export const genAiClassifiersApi = rootApi.injectEndpoints({
  tagTypes: defaultTags,
  endpoints: (builder) => ({
    createGenAiClassifier: builder.mutation({
      query: ({ groupId, documentTypeId, ...classifierData }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypesGroups.documentTypesGroup.documentTypes.documentType.genAiClassifiers(groupId, documentTypeId),
        method: RequestMethod.POST,
        body: classifierData,
      }),
      invalidatesTags: [GROUP_TAG],
    }),
    updateGenAiClassifier: builder.mutation({
      query: ({ genAiClassifierId, ...classifierData }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypesGroups.genAiClassifiers.genAiClassifier(genAiClassifierId),
        method: RequestMethod.PATCH,
        body: classifierData,
      }),
      invalidatesTags: [GROUP_TAG],
    }),
    deleteGenAiClassifier: builder.mutation({
      query: (id) => ({
        url: apiMap.apiGatewayV2.v5.documentTypesGroups.genAiClassifiers.genAiClassifier(id),
        method: RequestMethod.DELETE,
      }),
      invalidatesTags: [GROUP_TAG],
    }),
  }),
})

export const {
  useCreateGenAiClassifierMutation,
  useUpdateGenAiClassifierMutation,
  useDeleteGenAiClassifierMutation,
} = genAiClassifiersApi
