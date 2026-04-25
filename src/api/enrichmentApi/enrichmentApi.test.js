
import { mockEnv } from '@/mocks/mockEnv'
import { enrichmentApi } from '@/api/enrichmentApi'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const MOCK_TYPE_CODE = 'MOCK_TYPE_CODE'

const MOCK_REQUEST_RESPONSE = 'MOCK_REQUEST_RESPONSE'
const MOCK_DOCUMENT_TYPE_EXTRA_FIELD_CODE = 'Extra Field Code'

const MOCK_DOCUMENT_TYPE_EXTRA_FIELDS = [
  new DocumentTypeExtraField({
    code: MOCK_DOCUMENT_TYPE_EXTRA_FIELD_CODE,
    name: 'Extra Field Name',
    order: 0,
  }),
]

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/utils/apiRequest', () => ({
  apiRequest: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
  },
}))

test('method createExtraField should call to the apiRequest.post with correct endpoint uri that contains type code and field', async () => {
  apiRequest.post.mockImplementationOnce(() => Promise.resolve(MOCK_REQUEST_RESPONSE))

  const response = await enrichmentApi.createExtraField(MOCK_TYPE_CODE, MOCK_DOCUMENT_TYPE_EXTRA_FIELDS[0])

  expect(apiRequest.post)
    .toHaveBeenNthCalledWith(
      1,
      apiMap.apiGatewayV2.v5.documentTypes.documentType.extraFields(MOCK_TYPE_CODE),
      MOCK_DOCUMENT_TYPE_EXTRA_FIELDS[0],
    )
  expect(response).toEqual(MOCK_REQUEST_RESPONSE)
})

test('method deleteExtraFields should call to the apiRequest.delete with correct endpoint uri that contains type code and field code', async () => {
  apiRequest.delete.mockImplementationOnce(() => Promise.resolve(MOCK_REQUEST_RESPONSE))

  const response = await enrichmentApi.deleteExtraFields(MOCK_TYPE_CODE, [MOCK_DOCUMENT_TYPE_EXTRA_FIELD_CODE])

  expect(apiRequest.delete).toHaveBeenNthCalledWith(
    1,
    apiMap.apiGatewayV2.v5.documentTypes.documentType.extraFields(MOCK_TYPE_CODE, [MOCK_DOCUMENT_TYPE_EXTRA_FIELD_CODE]),
  )
  expect(response).toEqual(MOCK_REQUEST_RESPONSE)
})

test('method updateExtraFields should call to the apiRequest.put with correct endpoint uri that contains type code and fields', async () => {
  jest.clearAllMocks()

  const MOCK_EXTRA_FIELDS = new DocumentTypeExtraField({
    code: 'code',
    name: 'name',
  })

  apiRequest.put.mockImplementationOnce(() => Promise.resolve(MOCK_REQUEST_RESPONSE))

  const response = await enrichmentApi.updateExtraFields(
    MOCK_TYPE_CODE,
    MOCK_EXTRA_FIELDS,
  )

  expect(apiRequest.put).toHaveBeenNthCalledWith(
    1,
    apiMap.apiGatewayV2.v5.documentTypes.documentType.extraFields(MOCK_TYPE_CODE),
    { extraFields: MOCK_EXTRA_FIELDS },
  )
  expect(response).toEqual(MOCK_REQUEST_RESPONSE)
})
