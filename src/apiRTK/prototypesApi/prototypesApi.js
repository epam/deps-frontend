
import { rootApi } from '@/apiRTK/rootApi'
import { FieldType } from '@/enums/FieldType'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'

const defaultTags = ['Prototypes']

const mapFieldToCreateMappingDto = ({
  code,
  fieldType,
  fieldMeta,
  mapping,
}) => ({
  code,
  typeCode: (
    fieldType === FieldType.LIST
      ? fieldMeta.baseType
      : fieldType
  ),
  keys: mapping.keys,
  mappingType: mapping.mappingType,
})

const prototypesApi = rootApi.injectEndpoints({
  tagTypes: defaultTags,
  endpoints: (builder) => ({
    fetchPrototype: builder.query({
      query: (id) => apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype(id),
      providesTags: defaultTags,
    }),
    createPrototype: builder.mutation({
      query: (data) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.prototype(),
        method: RequestMethod.POST,
        body: data,
      }),
      invalidatesTags: defaultTags,
    }),
    updatePrototype: builder.mutation({
      query: ({ prototypeId, ...data }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype(prototypeId),
        method: RequestMethod.PATCH,
        body: data,
      }),
      invalidatesTags: defaultTags,
    }),
    createPrototypeFieldMapping: builder.mutation({
      query: ({ prototypeId, field }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.mappings(prototypeId),
        method: RequestMethod.POST,
        body: mapFieldToCreateMappingDto(field),
      }),
    }),
    updatePrototypeFieldMapping: builder.mutation({
      query: ({ prototypeId, fieldCode, keys }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.mappings.field(prototypeId, fieldCode),
        method: RequestMethod.PUT,
        body: { keys },
      }),
    }),
    createPrototypeTabularMapping: builder.mutation({
      query: ({ prototypeId, data }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.tabularMappings(prototypeId),
        method: RequestMethod.POST,
        body: data,
      }),
    }),
    updatePrototypeTabularMapping: builder.mutation({
      query: ({ prototypeId, fieldCode, tabularMapping }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.tabularMappings.field(prototypeId, fieldCode),
        method: RequestMethod.PATCH,
        body: tabularMapping,
      }),
    }),
  }),
})

export const {
  useFetchPrototypeQuery,
  useCreatePrototypeMutation,
  useUpdatePrototypeMutation,
  useCreatePrototypeFieldMappingMutation,
  useUpdatePrototypeFieldMappingMutation,
  useCreatePrototypeTabularMappingMutation,
  useUpdatePrototypeTabularMappingMutation,
} = prototypesApi
