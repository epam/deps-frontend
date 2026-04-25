
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { DOCUMENT_TYPES_GROUPS_PER_PAGE } from '@/constants/storage'
import { DocumentTypesGroupExtras } from '@/enums/DocumentTypesGroupExtras'
import { RequestMethod } from '@/enums/RequestMethod'
import { Pagination } from '@/models/Pagination'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { apiMap } from '@/utils/apiMap'
import {
  useAddDocumentTypesToGroupMutation,
  useCreateDocumentTypesGroupMutation,
  useDeleteDocumentTypesFromGroupMutation,
  useDeleteDocumentTypesGroupMutation,
  useFetchDocumentTypesGroupQuery,
  useFetchDocumentTypesGroupsQuery,
} from './documentTypesGroupsApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })

      return {
        useFetchDocumentTypesGroupsQuery: jest.fn((args) => res.fetchDocumentTypesGroups(args)),
        useFetchDocumentTypesGroupQuery: jest.fn((args) => res.fetchDocumentTypesGroup(args)),
        useCreateDocumentTypesGroupMutation: jest.fn((args) => res.createDocumentTypesGroup(args)),
        useDeleteDocumentTypesGroupMutation: jest.fn((args) => res.deleteDocumentTypesGroup(args)),
        useAddDocumentTypesToGroupMutation: jest.fn((args) => res.addDocumentTypesToGroup(args)),
        useDeleteDocumentTypesFromGroupMutation: jest.fn((args) => res.deleteDocumentTypesFromGroup(args)),
        endpoints: {
          fetchDocumentTypesGroup: {},
        },
      }
    },
  },
}))

describe('documentTypesGroupsApi: useFetchDocumentTypesGroupsQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const filterConfig = {
      ...DefaultPaginationConfig,
      ...Pagination.getInitialPagination(DOCUMENT_TYPES_GROUPS_PER_PAGE),
    }

    const { result } = renderHook(() => useFetchDocumentTypesGroupsQuery(filterConfig))

    await waitFor(() => {
      expect(result.current).toEqual(
        apiMap.apiGatewayV2.v5.documentTypesGroups(filterConfig),
      )
    })
  })
})

describe('documentTypesGroupsApi: useFetchDocumentTypesGroupQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const groupId = 'mockGroupId'

    const { result } = renderHook(() => useFetchDocumentTypesGroupQuery({ groupId }))

    await waitFor(() => {
      expect(result.current).toEqual(
        apiMap.apiGatewayV2.v5.documentTypesGroups.documentTypesGroup.extras(groupId),
      )
    })
  })

  test('calls correct endpoint with correct args if extras passed', async () => {
    const groupId = 'mockGroupId'
    const extras = [DocumentTypesGroupExtras.CLASSIFIERS]

    const { result } = renderHook(() => useFetchDocumentTypesGroupQuery({
      groupId,
      extras,
    }))

    await waitFor(() => {
      expect(result.current).toEqual(
        apiMap.apiGatewayV2.v5.documentTypesGroups.documentTypesGroup.extras(groupId, extras),
      )
    })
  })
})

describe('documentTypesGroupsApi: useCreateDocumentTypesGroupMutation', () => {
  test('calls correct endpoint', async () => {
    const { result } = renderHook(() => useCreateDocumentTypesGroupMutation())

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypesGroups(),
        method: RequestMethod.POST,
      })
    })
  })
})

describe('documentTypesGroupsApi: useDeleteDocumentTypesGroupMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const { result } = renderHook(() => useDeleteDocumentTypesGroupMutation())

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypesGroups(),
        method: RequestMethod.DELETE,
      })
    })
  })
})

describe('documentTypesGroupsApi: useAddDocumentTypesToGroupMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const groupId = 'id'
    const documentTypeIds = ['mockDocumentTypeId']

    const { result } = renderHook(() => useAddDocumentTypesToGroupMutation({
      groupId,
      documentTypeIds,
    }))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypesGroups.documentTypesGroup.documentTypes(groupId),
        method: RequestMethod.PATCH,
        body: {
          documentTypeIds,
        },
      })
    })
  })
})

describe('documentTypesGroupsApi: useDeleteDocumentTypesFromGroupMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const groupId = 'id'
    const id = ['mockDocumentTypeId']

    const { result } = renderHook(() => useDeleteDocumentTypesFromGroupMutation({
      groupId,
      id,
    }))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypesGroups.documentTypesGroup.documentTypes(
          groupId,
          { id },
        ),
        method: RequestMethod.DELETE,
      })
    })
  })
})
