
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'

const BATCHES_TAG = 'Batches'
const BATCH_TAG = 'Batch'

const defaultTags = [BATCHES_TAG, BATCH_TAG]

export const batchesApi = rootApi.injectEndpoints({
  tagTypes: defaultTags,
  endpoints: (builder) => ({
    fetchBatch: builder.query({
      query: (id) => apiMap.apiGatewayV2.v5.batches.batch(id),
      providesTags: [BATCH_TAG],
    }),
    fetchBatches: builder.query({
      query: (filters) => apiMap.apiGatewayV2.v5.batches(filters),
      providesTags: [BATCHES_TAG],
    }),
    deleteBatches: builder.mutation({
      query: (config) => ({
        url: apiMap.apiGatewayV2.v5.batches(config),
        method: RequestMethod.DELETE,
      }),
      invalidatesTags: defaultTags,
    }),
    deleteBatchesWithDocuments: builder.mutation({
      query: (config) => ({
        url: apiMap.apiGatewayV2.v5.batches.withDocuments(config),
        method: RequestMethod.DELETE,
      }),
      invalidatesTags: defaultTags,
    }),
    deleteBatchFiles: builder.mutation({
      query: ({ batchId, fileIds }) => ({
        url: apiMap.apiGatewayV2.v5.batches.batch.files(batchId, fileIds),
        method: RequestMethod.DELETE,
      }),
      invalidatesTags: defaultTags,
    }),
    deleteBatchFilesWithDocuments: builder.mutation({
      query: ({ batchId, fileIds }) => ({
        url: apiMap.apiGatewayV2.v5.batches.batch.files.withDocuments(batchId, fileIds),
        method: RequestMethod.DELETE,
      }),
      invalidatesTags: defaultTags,
    }),
    uploadFile: builder.mutation({
      query: (file) => {
        const formData = new FormData()
        formData.append('file', file)
        return ({
          url: apiMap.apiGatewayV2.v5.file(),
          method: RequestMethod.POST,
          body: formData,
        })
      },
    }),
    createBatch: builder.mutation({
      query: (data) => ({
        url: apiMap.apiGatewayV2.v5.batches(),
        method: RequestMethod.POST,
        body: data,
      }),
      invalidatesTags: defaultTags,
    }),
    uploadFilesToBatch: builder.mutation({
      query: ({ batchId, files }) => ({
        url: apiMap.apiGatewayV2.v5.batches.batch.files(batchId),
        method: RequestMethod.POST,
        body: { files },
      }),
      invalidatesTags: defaultTags,
    }),
    patchBatch: builder.mutation({
      query: ({ batchId, data }) => ({
        url: apiMap.apiGatewayV2.v5.batches.batch(batchId),
        method: RequestMethod.PATCH,
        body: data,
      }),
      invalidatesTags: [BATCHES_TAG],
    }),
  }),
})

export const {
  useCreateBatchMutation,
  useFetchBatchQuery,
  useFetchBatchesQuery,
  useDeleteBatchesMutation,
  useDeleteBatchesWithDocumentsMutation,
  useDeleteBatchFilesMutation,
  useDeleteBatchFilesWithDocumentsMutation,
  useUploadFileMutation,
  useUploadFilesToBatchMutation,
  usePatchBatchMutation,
} = batchesApi
