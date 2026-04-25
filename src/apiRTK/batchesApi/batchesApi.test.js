/* eslint-disable no-undef */

import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import {
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
} from './batchesApi'

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}))

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })

      return {
        useCreateBatchMutation: jest.fn(() => (args) => res.createBatch(args)),
        useFetchBatchQuery: jest.fn(() => (args) => res.fetchBatch(args)),
        useFetchBatchesQuery: jest.fn(() => (args) => res.fetchBatches(args)),
        useDeleteBatchesMutation: jest.fn(() => (args) => res.deleteBatches(args)),
        useDeleteBatchesWithDocumentsMutation: jest.fn(() => (args) => res.deleteBatchesWithDocuments(args)),
        useDeleteBatchFilesMutation: jest.fn(() => (args) => res.deleteBatchFiles(args)),
        useDeleteBatchFilesWithDocumentsMutation: jest.fn(() => (args) => res.deleteBatchFilesWithDocuments(args)),
        useUploadFileMutation: jest.fn(() => (args) => res.uploadFile(args)),
        useUploadFilesToBatchMutation: jest.fn(() => (args) => res.uploadFilesToBatch(args)),
        usePatchBatchMutation: jest.fn(() => (args) => res.patchBatch(args)),
      }
    },
  },
}))

describe('batchesApi: useFetchBatchesQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const id = 'mockId'

    const { result } = renderHook(() => useFetchBatchesQuery())

    await waitFor(() => {
      expect(result.current(id)).toEqual(
        apiMap.apiGatewayV2.v5.batches(id),
      )
    })
  })
})

describe('batchesApi: useDeleteBatchesMutation', () => {
  test('calls return correct config', async () => {
    const configToDelete = {
      ids: ['mockBatchId'],
    }

    const { result } = renderHook(() => useDeleteBatchesMutation())

    await waitFor(() => {
      expect(result.current(configToDelete)).toEqual(
        {
          method: 'delete',
          url: apiMap.apiGatewayV2.v5.batches(configToDelete),
        },
      )
    })
  })
})

describe('batchesApi: useFetchBatchQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const id = 'mockId'
    const { result } = renderHook(() => useFetchBatchQuery())

    await waitFor(() => {
      expect(result.current(id)).toEqual(
        apiMap.apiGatewayV2.v5.batches.batch(id),
      )
    })
  })
})

describe('batchesApi: useCreateBatchMutation', () => {
  test('calls return correct config', async () => {
    const batch = {}

    const { result } = renderHook(() => useCreateBatchMutation())

    await waitFor(() => {
      expect(result.current(batch)).toEqual(
        {
          method: 'post',
          url: apiMap.apiGatewayV2.v5.batches(),
          body: batch,
        },
      )
    })
  })
})

describe('batchesApi: useDeleteBatchesWithDocumentsMutation', () => {
  test('calls return correct config', async () => {
    const configToDelete = {
      ids: ['mockBatchId'],
    }

    const { result } = renderHook(() => useDeleteBatchesWithDocumentsMutation())

    await waitFor(() => {
      expect(result.current(configToDelete)).toEqual(
        {
          method: 'delete',
          url: apiMap.apiGatewayV2.v5.batches.withDocuments(configToDelete),
        },
      )
    })
  })
})

describe('batchesApi: useDeleteBatchFilesMutation', () => {
  test('calls return correct config', async () => {
    const configToDelete = {
      batchId: 'mockBatchId',
      fileIds: ['mockFileId'],
    }

    const { result } = renderHook(() => useDeleteBatchFilesMutation())

    await waitFor(() => {
      expect(result.current(configToDelete)).toEqual(
        {
          method: 'delete',
          url: apiMap.apiGatewayV2.v5.batches.batch.files(configToDelete.batchId, configToDelete.fileIds),
        },
      )
    })
  })
})

describe('batchesApi: useDeleteBatchFilesWithDocumentsMutation', () => {
  test('calls return correct config', async () => {
    const configToDelete = {
      batchId: 'mockBatchId',
      fileIds: ['mockFileId'],
    }

    const { result } = renderHook(() => useDeleteBatchFilesWithDocumentsMutation())

    await waitFor(() => {
      expect(result.current(configToDelete)).toEqual(
        {
          method: 'delete',
          url: apiMap.apiGatewayV2.v5.batches.batch.files.withDocuments(configToDelete.batchId, configToDelete.fileIds),
        },
      )
    })
  })
})

describe('batchesApi: useUploadFileMutation', () => {
  test('calls return correct config', async () => {
    const file = {}

    const mockFormData = {
      append: jest.fn((key, value) => {
        mockFormData[key] = value
      }),
    }

    global.FormData = jest.fn(() => mockFormData)

    const { result } = renderHook(() => useUploadFileMutation())

    await waitFor(() => {
      expect(result.current(file)).toEqual(
        {
          method: 'post',
          url: apiMap.apiGatewayV2.v5.file(),
          body: mockFormData,
        },
      )
    })
  })
})

describe('batchesApi: useUploadFilesToBatchMutation', () => {
  test('calls return correct config', async () => {
    const batchId = 'mockBatchId'
    const files = [
      {
        path: 'file1.pdf',
        documentTypeId: 'docType1',
      },
    ]

    const { result } = renderHook(() => useUploadFilesToBatchMutation())

    await waitFor(() => {
      expect(
        result.current({
          batchId: batchId,
          files: files,
        }),
      ).toEqual({
        method: 'post',
        url: apiMap.apiGatewayV2.v5.batches.batch.files(batchId),
        body: { files },
      })
    })
  })
})

describe('batchesApi: usePatchBatchMutation', () => {
  test('calls return correct config', async () => {
    const batchId = 'mockBatchId'
    const updateData = {
      name: 'Updated Batch Name',
    }

    const { result } = renderHook(() => usePatchBatchMutation())

    await waitFor(() => {
      expect(
        result.current({
          batchId,
          data: updateData,
        }),
      ).toEqual({
        method: RequestMethod.PATCH,
        url: apiMap.apiGatewayV2.v5.batches.batch(batchId),
        body: updateData,
      })
    })
  })
})
