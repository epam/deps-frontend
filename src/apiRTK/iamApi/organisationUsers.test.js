
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { OrgUserFilterKeys, PaginationKeys, SortDirection } from '@/constants/navigation'
import { MimeType } from '@/enums/MimeType'
import { RequestHeader } from '@/enums/RequestHeader'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import {
  useGetOrganisationUsersQuery,
  useDeleteOrganisationUsersMutation,
} from './organisationUsers'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })

      return {
        useGetOrganisationUsersQuery: jest.fn(() => (args) => res.getOrganisationUsers(args)),
        useDeleteOrganisationUsersMutation: jest.fn(() => (args) => res.deleteOrganisationUsers(args)),
      }
    },
  },
}))

const FILTER_CONFIG_SORTING_PARAMS = {
  [OrgUserFilterKeys.USER]: 'firstName_lastName',
  SORT: 'sortBy',
}

const FILTER_CONFIG_SEARCH_PARAMS = {
  [OrgUserFilterKeys.USER]: 'fullName',
}

describe('organisationUsers: useGetOrganisationUsersQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const mockOrganisationPk = 'testPk'
    const filters = {
      [PaginationKeys.PAGE]: 1,
      [PaginationKeys.PER_PAGE]: 10,
      [OrgUserFilterKeys.USER]: 'userName',
      [OrgUserFilterKeys.SORT_DIRECT]: SortDirection.ASC,
      [OrgUserFilterKeys.SORT_FIELD]: OrgUserFilterKeys.USER,
    }

    const fullNameSearchKey = FILTER_CONFIG_SEARCH_PARAMS[OrgUserFilterKeys.USER]
    const fullNameSortingKey = FILTER_CONFIG_SORTING_PARAMS[OrgUserFilterKeys.USER]

    const mappedFilter = {
      [PaginationKeys.PAGE]: 1,
      [PaginationKeys.PER_PAGE]: 10,
      [fullNameSearchKey]: 'userName',
      [FILTER_CONFIG_SORTING_PARAMS.SORT]: `${fullNameSortingKey}.${SortDirection.ASC}`,
    }
    const { result } = renderHook(() => useGetOrganisationUsersQuery())

    await waitFor(() => {
      expect(result.current({
        orgPk: mockOrganisationPk,
        filters,
      })).toEqual(
        apiMap.apiGatewayV2.v5.iam.organisation.users(mockOrganisationPk, mappedFilter),
      )
    })
  })
})

describe('organisationUsers: useDeleteOrganisationUsersMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const mockOrganisationPk = 'testPk'
    const userIds = ['userId1']

    const { result } = renderHook(() => useDeleteOrganisationUsersMutation())

    await waitFor(() => {
      expect(result.current({
        userIds,
        orgPk: mockOrganisationPk,
      })).toEqual({
        headers: {
          [RequestHeader.CONTENT_TYPE]: MimeType.APPLICATION_JSON,
        },
        url: apiMap.apiGatewayV2.v5.iam.organisation.users(mockOrganisationPk),
        method: RequestMethod.DELETE,
        body: JSON.stringify({ userIds }),
      })
    })
  })
})
