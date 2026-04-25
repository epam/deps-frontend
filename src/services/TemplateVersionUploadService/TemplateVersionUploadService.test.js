
import { mockEnv } from '@/mocks/mockEnv'
import { templatesApi } from '@/api/templatesApi'
import { TemplateVersionUploadService } from './TemplateVersionUploadService'

const mockFile = { name: 'mockFilename' }
const mockEvent = { percent: 50 }
const mockId = 'test'
const mockName = 'test'
const mockDescription = 'testDescription'
const mockErrorCallback = jest.fn()
const mockMarkupAutomatically = false

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/api/templatesApi', () => ({
  templatesApi: {
    uploadTemplateVersionFile: jest.fn(
      (
        {
          code: templateId,
        },
        onSuccess,
        onError,
        onProgress,
      ) => {
        onProgress(mockEvent)
        !templateId && Promise.resolve(mockErrorCallback())
        Promise.resolve(onSuccess())
      }),
  },
}))

describe('Service: TemplateVersionUploadService', () => {
  let uploader,
    onFileSuccess,
    onFileError,
    onFileProgress,
    templateId,
    file,
    name,
    description,
    markupAutomatically

  beforeEach(() => {
    onFileSuccess = jest.fn()
    onFileError = jest.fn()
    onFileProgress = jest.fn()

    uploader = new TemplateVersionUploadService(onFileSuccess, onFileError, onFileProgress)
    templateId = mockId
    file = mockFile
    name = mockName
    description = mockDescription
    markupAutomatically = mockMarkupAutomatically
  })

  it('should have correct methods from args', () => {
    expect(uploader.onFileSuccess).toEqual(onFileSuccess)
    expect(uploader.onFileError).toEqual(onFileError)
    expect(uploader.onFileProgress).toEqual(onFileProgress)
  })

  it('should call correct templatesApi method', () => {
    uploader.uploadTemplateVersion({
      templateId,
      file,
      name,
      description,
      markupAutomatically,
    })
    expect(templatesApi.uploadTemplateVersionFile)
      .nthCalledWith(
        1,
        {
          code: templateId,
          file,
          name,
          description,
          markupAutomatically,
        },
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
      )
  })

  it('should call onFilesSuccess callback on successful upload', () => {
    uploader.uploadTemplateVersion({
      templateId,
      file,
      name,
      description,
    })
    expect(onFileSuccess).nthCalledWith(1)
  })

  it('should call onFileError callback on failed upload', () => {
    uploader.uploadTemplateVersion({
      templateId: null,
      file,
      name,
      description,
    })
    expect(mockErrorCallback).nthCalledWith(1)
  })

  it('should call onFilesProgress callback while uploading', () => {
    uploader.uploadTemplateVersion({
      templateId,
      file,
      name,
      description,
    })
    expect(onFileProgress).nthCalledWith(1, mockFile, mockEvent)
  })
})
