
import { mockEnv } from '@/mocks/mockEnv'
import {
  fetchOutputProfiles,
  updateOutputProfile,
  createProfileOutput,
  createProfileOutputV2,
  deleteOutputProfile,
  fetchDocumentOutputs,
  deleteDocumentOutput,
  createOutputProfile,
} from '@/api/outputProfilesApi'
import { ExtractedDataSchema } from '@/models/OutputProfile'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const MOCK_API_RESULT = 'MOCK_API_RESULT'
const MOCK_ID = 'id'
const MOCK_DOCUMENT_TYPE_ID = 'docTypeId'
const MOCK_OUTPUT_ID = 'outputId'

const mockParams = {
  documentId: 'documentId',
  documentTypeId: 'documentTypeId',
  profileId: 'profileId',
  format: 'format',
  name: 'name',
  schema: new ExtractedDataSchema({
    fields: [],
    needsValidationResults: false,
  }),
}

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/apiMap')
jest.mock('@/utils/apiRequest', () => ({
  apiRequest: {
    get: jest.fn(() => MOCK_API_RESULT),
    put: jest.fn(() => MOCK_API_RESULT),
    delete: jest.fn(() => MOCK_API_RESULT),
    post: jest.fn(() => MOCK_API_RESULT),
  },
}))

describe('Service: outputProfilesApi', () => {
  it('should call apiRequest.get with correct url when calling fetchOutputProfiles', () => {
    fetchOutputProfiles(MOCK_ID)

    expect(apiRequest.get).toHaveBeenNthCalledWith(
      1,
      apiMap.outputExporting.v1.documentTypes.outputProfiles(MOCK_ID),
    )
  })

  it('should call apiRequest.put with correct url when calling updateOutputProfile', () => {
    const mockProfileData = 'mockProfileData'

    updateOutputProfile(
      MOCK_ID,
      MOCK_ID,
      mockProfileData,
    )

    expect(apiRequest.put).toHaveBeenNthCalledWith(
      1,
      apiMap.outputExporting.v1.documentTypes.outputProfile(
        MOCK_ID,
        MOCK_ID,
      ),
      mockProfileData,
    )
  })

  it('should call apiRequest.delete with correct url when calling deleteOutputProfile', () => {
    deleteOutputProfile(
      MOCK_DOCUMENT_TYPE_ID,
      MOCK_ID,
    )

    expect(apiRequest.delete).toHaveBeenNthCalledWith(
      1,
      apiMap.outputExporting.v1.documentTypes.outputProfile(
        MOCK_DOCUMENT_TYPE_ID,
        MOCK_ID,
      ),
    )
  })

  it('should call apiRequest.post with correct url when calling createProfileOutput', () => {
    const {
      documentId,
      documentTypeId,
      profileId,
      format,
    } = mockParams

    createProfileOutput(mockParams)

    expect(apiRequest.post).toHaveBeenNthCalledWith(
      1,
      apiMap.outputExporting.v1.documentTypes.outputProfiles(documentId),
      {
        documentTypeId,
        profileId,
        format,
      },
    )
  })

  it('should call apiRequest.post with correct url when calling createProfileOutputV2', () => {
    const {
      documentId,
      documentTypeId,
      profileId,
      format,
    } = mockParams

    createProfileOutputV2(mockParams)

    expect(apiRequest.post).toHaveBeenNthCalledWith(
      1,
      apiMap.outputExporting.v2.document.outputs(documentId),
      {
        documentTypeId,
        profileId,
        format,
      },
    )
  })

  it('should call apiRequest.get with correct url when calling fetchDocumentOutputs', () => {
    jest.clearAllMocks()

    fetchDocumentOutputs(MOCK_ID)

    expect(apiRequest.get).toHaveBeenNthCalledWith(
      1,
      apiMap.apiGatewayV2.v5.documents.document.outputs(MOCK_ID),
    )
  })

  it('should call apiRequest.delete with correct url when calling deleteDocumentOutput', () => {
    jest.clearAllMocks()

    deleteDocumentOutput(MOCK_ID, MOCK_OUTPUT_ID)

    expect(apiRequest.delete).toHaveBeenNthCalledWith(
      1,
      apiMap.outputExporting.v1.document.output(MOCK_ID, MOCK_OUTPUT_ID),
    )
  })

  it('should call apiRequest.post with correct url when calling createOutputProfile', () => {
    const {
      documentTypeId,
      name,
      schema,
      format,
    } = mockParams

    createOutputProfile(mockParams)

    expect(apiRequest.post).toHaveBeenNthCalledWith(
      1,
      apiMap.outputExporting.v1.document.outputs(documentTypeId),
      {
        name,
        schema,
        format,
      },
    )
  })
})
