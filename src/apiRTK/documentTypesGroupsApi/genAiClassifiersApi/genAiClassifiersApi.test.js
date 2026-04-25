
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import {
  useCreateGenAiClassifierMutation,
  useDeleteGenAiClassifierMutation,
  useUpdateGenAiClassifierMutation,
} from './genAiClassifiersApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })

      return {
        useCreateGenAiClassifierMutation: jest.fn((args) => res.createGenAiClassifier(args)),
        useUpdateGenAiClassifierMutation: jest.fn((args) => res.updateGenAiClassifier(args)),
        useDeleteGenAiClassifierMutation: jest.fn((args) => res.deleteGenAiClassifier(args)),
      }
    },
  },
}))

describe('genAiClassifiersApi: useCreateGenAiClassifierMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const groupId = 'groupId'
    const documentTypeId = 'documentTypeId'
    const formValue = 'val'

    const { result } = renderHook(() => useCreateGenAiClassifierMutation({
      documentTypeId,
      groupId,
      formValue,
    }))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypesGroups.documentTypesGroup.documentTypes.documentType.genAiClassifiers(groupId, documentTypeId),
        method: RequestMethod.POST,
        body: { formValue },
      })
    })
  })
})

describe('genAiClassifiersApi: useUpdateGenAiClassifierMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const genAiClassifierId = 'genAiClassifierId'
    const formValue = 'val'

    const { result } = renderHook(() => useUpdateGenAiClassifierMutation({
      genAiClassifierId,
      formValue,
    }))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypesGroups.genAiClassifiers.genAiClassifier(genAiClassifierId),
        method: RequestMethod.PATCH,
        body: { formValue },
      })
    })
  })
})

describe('genAiClassifiersApi: useDeleteGenAiClassifierMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const genAiClassifierId = 'genAiClassifierId'

    const { result } = renderHook(() => useDeleteGenAiClassifierMutation(genAiClassifierId))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypesGroups.genAiClassifiers.genAiClassifier(genAiClassifierId),
        method: RequestMethod.DELETE,
      })
    })
  })
})
