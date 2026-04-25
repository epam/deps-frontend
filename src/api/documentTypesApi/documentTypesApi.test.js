
import { mockEnv } from '@/mocks/mockEnv'
import { documentTypesApi } from '@/api/documentTypesApi'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { ExtractionType } from '@/enums/ExtractionType'
import { DocumentTypeV2 } from '@/models/DocumentTypeV2'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const EXTRAS_TO_REQUEST_PARAMETER = {
  [DocumentTypeExtras.EXTRACTION_FIELDS]: 'extraction-fields',
  [DocumentTypeExtras.EXTRA_FIELDS]: 'extra-fields',
  [DocumentTypeExtras.VALIDATORS]: 'validators',
  [DocumentTypeExtras.PROFILES]: 'profiles',
  [DocumentTypeExtras.LLM_EXTRACTORS]: 'llm-extractors',
}

const MOCK_TYPE_CODE = 'MOCK_TYPE_CODE'
const MOCK_TYPE_NAME = 'MOCK_TYPE_NAME'
const MOCK_REQUEST_RESPONSE = 'MOCK_REQUEST_RESPONSE'
const MOCK_OUTPUT_PROFILE = 'MOCK_OUTPUT_PROFILE'

const MOCK_DOCUMENT_TYPE_V2 = new DocumentTypeV2({
  id: MOCK_TYPE_CODE,
  documentType: MOCK_TYPE_NAME,
})

const mockProfiles = [MOCK_OUTPUT_PROFILE]

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/utils/apiRequest', () => ({
  apiRequest: {
    get: jest.fn(() => MOCK_REQUEST_RESPONSE),
    post: jest.fn(() => MOCK_REQUEST_RESPONSE),
    patch: jest.fn(() => MOCK_REQUEST_RESPONSE),
    put: jest.fn(() => MOCK_REQUEST_RESPONSE),
  },
}))

jest.mock('@/api/outputProfilesApi', () => ({
  fetchOutputProfiles: jest.fn(() => Promise.resolve({
    profiles: mockProfiles,
  })),
}))

describe('API: DocumentTypesApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Method: fetchDocumentTypes', () => {
    it('should call to the apiRequest.get with correct endpoint uri and extractionType', async () => {
      apiRequest.get.mockImplementationOnce(() => Promise.resolve({ result: [MOCK_DOCUMENT_TYPE_V2] }))

      const extractionType = ExtractionType.TEMPLATE
      const response = await documentTypesApi.fetchDocumentTypes(extractionType)

      expect(apiRequest.get).nthCalledWith(1, apiMap.apiGatewayV2.v5.documentTypes({
        extractionType,
        workflowConfigurations: true,
      }))
      expect(response).toEqual([DocumentTypeV2.toDocumentTypeV1(MOCK_DOCUMENT_TYPE_V2)])
    })
  })

  describe('Method: fetchDocumentType', () => {
    it('should call apiRequest.get with correct endpoint uri that contains type code and extra parameters',
      async () => {
        const extras = [
          DocumentTypeExtras.EXTRACTION_FIELDS,
          DocumentTypeExtras.EXTRA_FIELDS,
          DocumentTypeExtras.PROFILES,
          DocumentTypeExtras.VALIDATORS,
          DocumentTypeExtras.LLM_EXTRACTORS,
        ]

        const expectedParameters = extras.map((extra) => EXTRAS_TO_REQUEST_PARAMETER[extra])

        apiRequest.get.mockImplementationOnce(() => Promise.resolve(MOCK_DOCUMENT_TYPE_V2))

        const response = await documentTypesApi.fetchDocumentType(MOCK_TYPE_CODE, extras)

        expect(apiRequest.get).nthCalledWith(
          1,
          apiMap.apiGatewayV2.v5.documentTypes.documentType.extras(MOCK_TYPE_CODE, expectedParameters),
        )
        expect(response).toEqual(DocumentTypeV2.toExtendedDocumentType(MOCK_DOCUMENT_TYPE_V2))
      })
  })

  describe('Method: createDocumentType', () => {
    it('should call to the apiRequest.post with correct endpoint uri to create a document type', () => {
      const documentTypeData = {
        name: 'New Document Type',
      }

      const response = documentTypesApi.createDocumentType(documentTypeData)

      expect(apiRequest.post).nthCalledWith(1, apiMap.apiGatewayV2.v5.documentTypes.attachExtractor(), documentTypeData)
      expect(response).toBe(MOCK_REQUEST_RESPONSE)
    })
  })

  describe('Method: validateField', () => {
    test('calls validation endpoint with correct parameters', async () => {
      const mockValidation = {
        fieldValidations: [],
        crossFieldValidations: [],
      }
      apiRequest.post.mockResolvedValue(mockValidation)

      const documentTypeId = 'invoiceType'
      const validatorCode = 'fieldCode'
      const documentId = 'doc-123'

      const result = await documentTypesApi.validateField(
        documentTypeId,
        validatorCode,
        documentId,
      )

      expect(apiRequest.post).toHaveBeenNthCalledWith(
        1,
        apiMap.apiGatewayV2.v5.documentTypes.documentType.validators.validator.validate(
          documentTypeId,
          validatorCode,
        ),
        { documentId },
      )
      expect(result).toEqual(mockValidation)
    })

    test('propagates request errors', async () => {
      const mockError = {
        request: { status: 503 },
        message: 'Server error',
      }
      apiRequest.post.mockRejectedValue(mockError)

      await expect(
        documentTypesApi.validateField('type', 'field', 'doc-456'),
      ).rejects.toEqual(mockError)
    })
  })
})
