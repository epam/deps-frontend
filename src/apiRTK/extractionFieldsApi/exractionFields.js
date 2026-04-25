
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'

const defaultTags = ['ExtractionFields']

const mapFieldToRequestBody = ({
  name,
  required,
  readOnly,
  confidential,
  order,
  fieldMeta,
  fieldType,
  extractorId,
}) => ({
  name,
  required,
  readOnly,
  confidential,
  order,
  description: fieldMeta,
  type: fieldType,
  extractorId,
})

export const extractionFieldsApi = rootApi.injectEndpoints({
  tagTypes: defaultTags,
  endpoints: (builder) => ({
    createExtractionField: builder.mutation({
      query: ({ documentTypeCode, field }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.extractionFields(documentTypeCode),
        method: RequestMethod.POST,
        body: mapFieldToRequestBody(field),
      }),
    }),
    updateExtractionField: builder.mutation({
      query: ({
        documentTypeCode,
        extractorId,
        fieldCode,
        data,
      }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.extractionFields.extractionField(documentTypeCode, fieldCode, extractorId),
        method: RequestMethod.PATCH,
        body: mapFieldToRequestBody(data),
      }),
    }),
    updateExtractionFields: builder.mutation({
      query: ({ documentTypeCode, fields }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.extractionFields(documentTypeCode),
        method: RequestMethod.PATCH,
        body: { fields },
      }),
    }),
    deleteExtractionField: builder.mutation({
      query: ({ documentTypeCode, fieldCodes }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.extractionFields(documentTypeCode, fieldCodes),
        method: RequestMethod.DELETE,
      }),
    }),
  }),
})

export const {
  useCreateExtractionFieldMutation,
  useUpdateExtractionFieldMutation,
  useUpdateExtractionFieldsMutation,
  useDeleteExtractionFieldMutation,
} = extractionFieldsApi
