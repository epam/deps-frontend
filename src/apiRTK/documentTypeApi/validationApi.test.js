
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import {
  useCreateCrossFieldValidatorMutation,
  useDeleteCrossFieldValidatorMutation,
  useDeleteValidatorRuleMutation,
  useUpdateCrossFieldValidatorMutation,
} from './validationApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })

      return {
        useCreateCrossFieldValidatorMutation: jest.fn(() => (args) => res.createCrossFieldValidator(args)),
        useDeleteCrossFieldValidatorMutation: jest.fn(() => (args) => res.deleteCrossFieldValidator(args)),
        useDeleteValidatorRuleMutation: jest.fn(() => (args) => res.deleteValidatorRule(args)),
        useUpdateCrossFieldValidatorMutation: jest.fn(() => (args) => res.updateCrossFieldValidator(args)),
      }
    },
  },
}))

describe('validationApi: useCreateCrossFieldValidatorMutation', () => {
  test('calls correct endpoint', async () => {
    const mockDocumentTypeId = 'id'
    const mockData = {
      name: 'Cross field validator',
    }

    const { result } = renderHook(() => useCreateCrossFieldValidatorMutation())

    await waitFor(() => {
      expect(result.current({
        documentTypeId: mockDocumentTypeId,
        data: mockData,
      })).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.crossFieldValidators(mockDocumentTypeId),
        method: RequestMethod.POST,
        body: mockData,
      })
    })
  })
})

describe('validationApi: useDeleteCrossFieldValidatorMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const documentTypeId = 'mockDocumentId'
    const validatorId = 'mockValidatorId'

    const { result } = renderHook(() => useDeleteCrossFieldValidatorMutation())

    await waitFor(() => {
      expect(result.current({
        documentTypeId,
        validatorId,
      })).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.crossFieldValidators.validator(documentTypeId, validatorId),
        method: RequestMethod.DELETE,
      })
    })
  })
})

describe('validationApi: useDeleteValidatorRuleMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const documentTypeId = 'mockDocumentId'
    const validatorCode = 'mockValidatorCode'
    const ruleName = 'mockRuleName'

    const { result } = renderHook(() => useDeleteValidatorRuleMutation())

    await waitFor(() => {
      expect(result.current({
        documentTypeId,
        validatorCode,
        ruleName,
      })).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.validators.validator.rules.rule(documentTypeId, validatorCode, ruleName),
        method: RequestMethod.DELETE,
      })
    })
  })
})

describe('validationApi: useUpdateCrossFieldValidatorMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const documentTypeId = 'mockDocumentTypeId'
    const validatorId = 'mockValidatorId'
    const data = {
      name: 'Cross field validator',
    }

    const { result } = renderHook(() => useUpdateCrossFieldValidatorMutation())

    await waitFor(() => {
      expect(result.current({
        documentTypeId,
        validatorId,
        data,
      })).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.crossFieldValidators.validator(documentTypeId, validatorId),
        method: RequestMethod.PATCH,
        body: data,
      })
    })
  })
})
