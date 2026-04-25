
import { mockEnv } from '@/mocks/mockEnv'
import {
  createTemplate,
  fetchTemplateVersions,
  fetchTemplateVersion,
  uploadTemplateVersionFile,
  deleteTemplateVersion,
  updateTemplateVersionName,
  fetchTemplateMarkupState,
} from '@/api/templatesApi'
import { TemplateVersion } from '@/models/TemplateVersion'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const MOCK_ID = 1

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/apiRequest')

describe('Service: templatesApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call to the apiRequest.get with correct url when calling fetchTemplateVersions', async () => {
    await fetchTemplateVersions(MOCK_ID)
    expect(apiRequest.get).toHaveBeenNthCalledWith(1, apiMap.apiGatewayV2.v5.documentTypes.documentType.template.versions(MOCK_ID))
  })

  it('should call to the apiRequest.post with correct url when calling createTemplate', async () => {
    const mockRequestData = { name: 'name' }
    await createTemplate(mockRequestData)
    expect(apiRequest.post).toHaveBeenNthCalledWith(1, apiMap.apiGatewayV2.v5.documentTypes.template(), mockRequestData)
  })

  it('should call to the apiRequest.get with correct url when calling fetchTemplateVersion', async () => {
    const mockVersionId = 2
    await fetchTemplateVersion(MOCK_ID, mockVersionId)
    expect(apiRequest.get).nthCalledWith(
      1,
      apiMap.apiGatewayV2.v5.documentTypes.documentType.template.versions.version(MOCK_ID, mockVersionId),
    )
  })

  it('should call to the apiRequest.delete with correct url when calling deleteTemplateVersion', async () => {
    const mockVersionId = 2
    await deleteTemplateVersion(MOCK_ID, mockVersionId)
    expect(apiRequest.delete).nthCalledWith(
      1,
      apiMap.apiGatewayV2.v5.documentTypes.documentType.template.versions.delete(MOCK_ID, [mockVersionId]),
    )
  })

  it('should call to the apiRequest.post with correct url when calling uploadTemplateVersionFile', async () => {
    const mockFile = ['mockFile']
    const mockFileName = 'mockFileName'
    const mockDescription = 'mockDescription'
    const mockMarkupAutomatically = false
    const formData = new FormData()
    formData.append('files', ['mockFile'])
    formData.append('name', 'mockFileName')
    formData.append('description', 'mockDescription')
    formData.append('markupAutomatically', mockMarkupAutomatically)
    const onSuccess = jest.fn()
    const onError = jest.fn()
    const onProgress = jest.fn()
    await uploadTemplateVersionFile(
      {
        code: MOCK_ID,
        file: mockFile,
        name: mockFileName,
        description: mockDescription,
        markupAutomatically: mockMarkupAutomatically,
      },
      onSuccess,
      onError,
      onProgress,
    )
    expect(apiRequest.formPost).toHaveBeenNthCalledWith(
      1,
      apiMap.apiGatewayV2.v5.documentTypes.documentType.template.versions(MOCK_ID),
      formData,
      {
        onSuccess,
        onError,
        onProgress,
      },
    )
  })

  it('should call to the apiRequest.patch with correct url when calling updateTemplateVersionName', async () => {
    const mockVersion = new TemplateVersion({
      id: 'testId',
      name: 'testName',
      createdAt: '20023-12-12',
      templateId: 'templateId',
    })

    await updateTemplateVersionName(MOCK_ID, mockVersion)
    expect(apiRequest.patch).nthCalledWith(
      1,
      apiMap.apiGatewayV2.v5.documentTypes.documentType.template.versions.version(MOCK_ID, mockVersion.id),
      {
        name: mockVersion.name,
      },
    )
  })

  it('should call to the apiRequest.get with correct url when calling fetchTemplateMarkupState', async () => {
    await fetchTemplateMarkupState(MOCK_ID)

    expect(apiRequest.get).nthCalledWith(
      1,
      apiMap.apiGatewayV2.v5.sagas.saga.state(MOCK_ID),
    )
  })
})
