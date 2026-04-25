
import { rootApi } from '@/apiRTK/rootApi'
import { apiMap } from '@/utils/apiMap'

const SERVICES_TAG = 'Services'
const defaultTags = [SERVICES_TAG]

const servicesApi = rootApi.injectEndpoints({
  tagTypes: defaultTags,
  endpoints: (builder) => ({
    fetchServices: builder.query({
      query: () => apiMap.apiGatewayV2.v5.services(),
      providesTags: defaultTags,
    }),
  }),
})

export const {
  useFetchServicesQuery,
} = servicesApi
