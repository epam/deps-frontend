
import { rootApi } from '@/apiRTK/rootApi'
import { OrgUserFilterKeys, PaginationKeys } from '@/constants/navigation'
import { MimeType } from '@/enums/MimeType'
import { RequestHeader } from '@/enums/RequestHeader'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'

const FILTER_CONFIG_SORTING_PARAMS = {
  [OrgUserFilterKeys.USER]: 'firstName_lastName',
  SORT: 'sortBy',
}

const FILTER_CONFIG_SEARCH_PARAMS = {
  [OrgUserFilterKeys.USER]: 'fullName',
}

const getOrganisationUsersEndpoint = (orgPk, filters) => {
  const mappedFilter = {
    [PaginationKeys.PAGE]: filters.page,
    [PaginationKeys.PER_PAGE]: filters.perPage,
    [FILTER_CONFIG_SEARCH_PARAMS[OrgUserFilterKeys.USER]]: filters.user,
    [FILTER_CONFIG_SORTING_PARAMS.SORT]: filters.sortDirect && (
      `${FILTER_CONFIG_SORTING_PARAMS[filters.sortField]}.${filters.sortDirect}`
    ),
  }
  return apiMap.apiGatewayV2.v5.iam.organisation.users(orgPk, mappedFilter)
}

const defaultTags = ['OrganisationUsers']

export const organisationUsers = rootApi.injectEndpoints({
  tagTypes: defaultTags,
  endpoints: (builder) => ({
    getOrganisationUsers: builder.query({
      query: ({ orgPk, filters }) => getOrganisationUsersEndpoint(orgPk, filters),
      providesTags: defaultTags,
    }),
    deleteOrganisationUsers: builder.mutation({
      query: ({ userIds, orgPk }) => ({
        headers: {
          [RequestHeader.CONTENT_TYPE]: MimeType.APPLICATION_JSON,
        },
        url: apiMap.apiGatewayV2.v5.iam.organisation.users(orgPk),
        method: RequestMethod.DELETE,
        body: JSON.stringify({ userIds }),
      }),
      invalidatesTags: defaultTags,
    }),
  }),
})

export const {
  useGetOrganisationUsersQuery,
  useDeleteOrganisationUsersMutation,
} = organisationUsers
