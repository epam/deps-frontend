
import { rootApi } from '@/apiRTK/rootApi'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'

const validationApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    createCrossFieldValidator: builder.mutation({
      query: ({ documentTypeId, data }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.crossFieldValidators(documentTypeId),
        method: RequestMethod.POST,
        body: data,
      }),
    }),
    updateCrossFieldValidator: builder.mutation({
      query: ({ documentTypeId, validatorId, data }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.crossFieldValidators.validator(documentTypeId, validatorId),
        method: RequestMethod.PATCH,
        body: data,
      }),
    }),
    deleteCrossFieldValidator: builder.mutation({
      query: ({ documentTypeId, validatorId }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.crossFieldValidators.validator(documentTypeId, validatorId),
        method: RequestMethod.DELETE,
      }),
    }),
    deleteValidatorRule: builder.mutation({
      query: ({ documentTypeId, validatorCode, ruleName }) => ({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.validators.validator.rules.rule(documentTypeId, validatorCode, ruleName),
        method: RequestMethod.DELETE,
      }),
    }),
  }),
})

export const {
  useCreateCrossFieldValidatorMutation,
  useDeleteCrossFieldValidatorMutation,
  useDeleteValidatorRuleMutation,
  useUpdateCrossFieldValidatorMutation,
} = validationApi
