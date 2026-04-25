
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'

const transformUnifiedData = (unifiedData) => (
  unifiedData.elements.reduce((acc, d) => {
    acc[d.page]
      ? acc[d.page] = [...acc[d.page], d]
      : acc[d.page] = [d]
    return acc
  }, {})
)

const PROTOTYPE_LAYOUTS_LIST_TAG = 'PrototypeLayoutsList'
const PROTOTYPE_LAYOUT_TAG = 'PrototypeLayout'
const FETCH_PROTOTYPE_LAYOUT_ENDPOINT = 'fetchPrototypeLayout'

export const prototypeLayoutApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchPrototypeLayouts: builder.query({
      query: (prototypeId) => apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.layouts(prototypeId),
      transformResponse: (response) => response.reference_layouts,
      providesTags: [PROTOTYPE_LAYOUTS_LIST_TAG],
    }),
    [FETCH_PROTOTYPE_LAYOUT_ENDPOINT]: builder.query({
      query: ({ prototypeId, layoutId }) => apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.layouts.layout(prototypeId, layoutId),
      transformResponse: (response) => {
        if (response.unifiedData) {
          response.unifiedData = transformUnifiedData(response.unifiedData)
        }
        return response
      },
      providesTags: [PROTOTYPE_LAYOUT_TAG],
    }),
    createPrototypeLayout: builder.mutation({
      query: ({ prototypeId, file }) => {
        const body = new FormData()
        body.append('file', file)
        return {
          url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.layouts(prototypeId),
          method: RequestMethod.POST,
          body,
        }
      },
      invalidatesTags: [PROTOTYPE_LAYOUTS_LIST_TAG],
    }),
    restartPrototypeLayout: builder.mutation({
      query: ({ prototypeId, layoutId }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.layouts.layout.restart(prototypeId, layoutId),
        method: RequestMethod.POST,
      }),
      invalidatesTags: [PROTOTYPE_LAYOUT_TAG, PROTOTYPE_LAYOUTS_LIST_TAG],
    }),
    deletePrototypeLayout: builder.mutation({
      query: ({ prototypeId, layoutId }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.layouts.delete(prototypeId, [layoutId]),
        method: RequestMethod.DELETE,
      }),
      async onQueryStarted ({ prototypeId, layoutId, isLastLayout }, { dispatch, queryFulfilled }) {
        if (!isLastLayout) {
          return
        }

        await queryFulfilled
        dispatch(
          prototypeLayoutApi.util.updateQueryData(
            FETCH_PROTOTYPE_LAYOUT_ENDPOINT,
            {
              prototypeId,
              layoutId,
            },
            () => null,
          ),
        )
      },
      invalidatesTags: [PROTOTYPE_LAYOUTS_LIST_TAG],
    }),
  }),
})

export const {
  useFetchPrototypeLayoutsQuery,
  useFetchPrototypeLayoutQuery,
  useCreatePrototypeLayoutMutation,
  useRestartPrototypeLayoutMutation,
  useDeletePrototypeLayoutMutation,
} = prototypeLayoutApi
