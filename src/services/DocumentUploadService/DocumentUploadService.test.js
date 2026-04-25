
import { documentsApi } from '@/api/documentsApi'
import { DocumentAsyncUploadService } from './DocumentAsyncUploadService'
import { DocumentSyncUploadService } from './DocumentSyncUploadService'

const mockDocumentWithOneFile = {
  uid: 'mockUIDFile1',
  name: 'date - mockDocumentName1.pdf',
  files: [
    {
      uid: 'mockUIDFile1',
      name: 'mockFileName1',
    },
  ],
}

const mockDocumentWithTwoFile = {
  uid: 'mockUIDFile2',
  name: 'date - mockDocumentName2.pdf',
  files: [
    {
      uid: 'mockUIDFile2',
      name: 'mockFileName2',
    },
    {
      uid: 'mockUIDFile22',
      name: 'mockFileName22',
    },
  ],
}

const mockDocument = 'mockDocument'
const mockFile = 'mockFile'
const mockPercent = 'mockFile'
const mockBatchId = 'mockBatchId'

jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    createMultiUploadSession: jest.fn(() => Promise.resolve({ batchId: mockBatchId })),
    runPipeline: jest.fn(() => Promise.resolve()),
    createDocumentLegacy: jest.fn((pageFile, data, onSuccess) => {
      onSuccess()
    }),
  },
}))

describe('Service: DocumentAsyncUploadService', () => {
  let uploader, onFileProgress, onDocumentError, onDocumentSuccess, documents

  beforeEach(() => {
    onFileProgress = jest.fn()
    onDocumentError = jest.fn()
    onDocumentSuccess = jest.fn()

    documentsApi.createMultiUploadSession.mockClear()
    documentsApi.createDocumentLegacy.mockClear()
    documentsApi.runPipeline.mockClear()

    uploader = new DocumentAsyncUploadService(onFileProgress, onDocumentError, onDocumentSuccess)
    documents = [mockDocumentWithOneFile]
  })

  it('should have correct methods from args', () => {
    expect(uploader.onFileProgress).toEqual(onFileProgress)
    expect(uploader.onDocumentError).toEqual(onDocumentError)
    expect(uploader.onDocumentSuccess).toEqual(onDocumentSuccess)
  })

  it('should not have methods in case empty arguments', () => {
    uploader = new DocumentAsyncUploadService()
    expect(uploader.onFileProgress).toEqual(undefined)
    expect(uploader.onDocumentError).toEqual(undefined)
    expect(uploader.onDocumentSuccess).toEqual(undefined)
  })

  it('should call onFileProgressArg callback when calling to uploader.onFileProgress', () => {
    uploader.onFileProgress(mockDocument, mockFile, mockPercent)
    expect(onFileProgress).toHaveBeenCalledWith(mockDocument, mockFile, mockPercent)
  })

  it('should call onDocumentErrorArg callback when calling to uploader.onDocumentError', () => {
    uploader.onDocumentError(mockDocument)
    expect(onDocumentError).toHaveBeenCalledWith(mockDocument)
  })

  it('should call onDocumentSuccessArg callback when calling to uploader.onDocumentSuccess', () => {
    uploader.onDocumentSuccess(mockDocument)
    expect(onDocumentSuccess).toHaveBeenCalledWith(mockDocument)
  })

  const expectOnSuccessAfterUploadsComplete = (documents, expectForSuccess) => {
    let successCallCount = 0
    const uploader = new DocumentAsyncUploadService(
      onFileProgress,
      onDocumentError,
      () => {
        if (documents.length - 1 === successCallCount) {
          expectForSuccess()
        }
        successCallCount++
      })

    uploader.upload(documents)
  }

  it('should call correct documentsApi methods for document with one file', (done) => {
    expectOnSuccessAfterUploadsComplete(documents, () => {
      expect(documentsApi.createMultiUploadSession).toHaveBeenCalledTimes(0)
      expect(documentsApi.createDocumentLegacy).toHaveBeenCalledTimes(1)
      expect(documentsApi.runPipeline).toHaveBeenCalledTimes(0)
      done()
    })
  })

  it('should call correct documentsApi methods for document with two files', (done) => {
    documents = [mockDocumentWithTwoFile]
    expectOnSuccessAfterUploadsComplete(documents, () => {
      expect(documentsApi.createMultiUploadSession).toHaveBeenCalledTimes(1)
      expect(documentsApi.createDocumentLegacy).toHaveBeenCalledTimes(2)
      expect(documentsApi.runPipeline).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('should call correct documentsApi methods for documents (with 1 and 2 files)', (done) => {
    documents = [mockDocumentWithOneFile, mockDocumentWithTwoFile]
    expectOnSuccessAfterUploadsComplete(documents, () => {
      expect(documentsApi.createMultiUploadSession).toHaveBeenCalledTimes(1)
      expect(documentsApi.createDocumentLegacy).toHaveBeenCalledTimes(3)
      expect(documentsApi.runPipeline).toHaveBeenCalledTimes(1)
      done()
    })
  })

  const expectOnErrorAfterUploadsComplete = (documents, expectForError) => {
    const uploader = new DocumentAsyncUploadService(
      onFileProgress,
      (document) => {
        expectForError(document)
      },
      onDocumentSuccess,
    )
    uploader.upload(documents)
  }

  it('should pass correct document to onDocumentError callback in case documentsApi.createMultiUploadSession rejection', (done) => {
    documents = [mockDocumentWithTwoFile]
    documentsApi.createMultiUploadSession.mockImplementationOnce(() => Promise.reject(new Error('mockError')))
    expectOnErrorAfterUploadsComplete(documents, (doc) => {
      expect(doc).toEqual(documents[0])
      done()
    })
  })

  it('should pass correct document to onDocumentError callback in case documentsApi.runPipeline rejection', (done) => {
    documents = [mockDocumentWithTwoFile]
    documentsApi.runPipeline.mockImplementationOnce(() => Promise.reject(new Error('mockError')))
    expectOnErrorAfterUploadsComplete(documents, (doc) => {
      expect(doc).toEqual(documents[0])
      done()
    })
  })

  const expectOnProgressAfterUploadsComplete = (documents, expectForProgress) => {
    const uploader = new DocumentAsyncUploadService(
      (document, file, percent) => {
        expectForProgress(document, file, percent)
      },
      onDocumentError,
      onDocumentSuccess,
    )
    uploader.upload(documents)
  }

  it('should call onFileProgress callback with correct arguments (document, file, percent)', (done) => {
    const mockEvent = { percent: 99 }
    documentsApi.createDocumentLegacy.mockImplementationOnce((pageFile, data, onSuccess, onError, onProgress) => {
      onProgress(mockEvent)
    })

    expectOnProgressAfterUploadsComplete(documents, (document, file, percent) => {
      expect(document).toEqual(documents[0])
      expect(file).toEqual(documents[0].files[0])
      expect(percent).toEqual(mockEvent.percent)
      done()
    })
  })
})

describe('Service: DocumentSyncUploadService', () => {
  let uploader, onFileProgress, onDocumentError, onDocumentSuccess, documents

  beforeEach(() => {
    onFileProgress = jest.fn()
    onDocumentError = jest.fn()
    onDocumentSuccess = jest.fn()

    documentsApi.createMultiUploadSession.mockClear()
    documentsApi.createDocumentLegacy.mockClear()
    documentsApi.runPipeline.mockClear()

    uploader = new DocumentSyncUploadService(onFileProgress, onDocumentError, onDocumentSuccess)
    documents = [mockDocumentWithOneFile]
  })

  it('should have correct methods from args', () => {
    expect(uploader.onFileProgress).toEqual(onFileProgress)
    expect(uploader.onDocumentError).toEqual(onDocumentError)
    expect(uploader.onDocumentSuccess).toEqual(onDocumentSuccess)
  })

  it('should not have methods in case empty arguments', () => {
    uploader = new DocumentSyncUploadService()
    expect(uploader.onFileProgress).toEqual(undefined)
    expect(uploader.onDocumentError).toEqual(undefined)
    expect(uploader.onDocumentSuccess).toEqual(undefined)
  })

  it('should call onFileProgressArg callback when calling to uploader.onFileProgress', () => {
    uploader.onFileProgress(mockDocument, mockFile, mockPercent)
    expect(onFileProgress).toHaveBeenCalledWith(mockDocument, mockFile, mockPercent)
  })

  it('should call onDocumentErrorArg callback when calling to uploader.onDocumentError', () => {
    uploader.onDocumentError(mockDocument)
    expect(onDocumentError).toHaveBeenCalledWith(mockDocument)
  })

  it('should call onDocumentSuccessArg callback when calling to uploader.onDocumentSuccess', () => {
    uploader.onDocumentSuccess(mockDocument)
    expect(onDocumentSuccess).toHaveBeenCalledWith(mockDocument)
  })

  const expectOnSuccessAfterUploadsComplete = (documents, expectForSuccess) => {
    let successCallCount = 0
    const uploader = new DocumentSyncUploadService(
      onFileProgress,
      onDocumentError,
      () => {
        if (documents.length - 1 === successCallCount) {
          expectForSuccess()
        }
        successCallCount++
      })

    uploader.upload(documents)
  }

  it('should call correct documentsApi methods for document with one file', (done) => {
    expectOnSuccessAfterUploadsComplete(documents, () => {
      expect(documentsApi.createMultiUploadSession).toHaveBeenCalledTimes(0)
      expect(documentsApi.createDocumentLegacy).toHaveBeenCalledTimes(1)
      expect(documentsApi.runPipeline).toHaveBeenCalledTimes(0)
      done()
    })
  })

  it('should call correct documentsApi methods for document with two files', (done) => {
    documents = [mockDocumentWithTwoFile]
    expectOnSuccessAfterUploadsComplete(documents, () => {
      expect(documentsApi.createMultiUploadSession).toHaveBeenCalledTimes(1)
      expect(documentsApi.createDocumentLegacy).toHaveBeenCalledTimes(2)
      expect(documentsApi.runPipeline).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('should call correct documentsApi methods for documents (with 1 and 2 files)', (done) => {
    documents = [mockDocumentWithOneFile, mockDocumentWithTwoFile]
    expectOnSuccessAfterUploadsComplete(documents, () => {
      expect(documentsApi.createMultiUploadSession).toHaveBeenCalledTimes(1)
      expect(documentsApi.createDocumentLegacy).toHaveBeenCalledTimes(3)
      expect(documentsApi.runPipeline).toHaveBeenCalledTimes(1)
      done()
    })
  })

  const expectOnErrorAfterUploadsComplete = (documents, expectForError) => {
    const uploader = new DocumentSyncUploadService(
      onFileProgress,
      (document) => {
        expectForError(document)
      },
      onDocumentSuccess,
    )
    uploader.upload(documents)
  }

  it('should pass correct document to onDocumentError callback in case documentsApi.createMultiUploadSession rejection', (done) => {
    documents = [mockDocumentWithTwoFile]
    documentsApi.createMultiUploadSession.mockImplementationOnce(() => Promise.reject(new Error('mockError')))
    expectOnErrorAfterUploadsComplete(documents, (doc) => {
      expect(doc).toEqual(documents[0])
      done()
    })
  })

  it('should pass correct document to onDocumentError callback in case documentsApi.runPipeline rejection', (done) => {
    documents = [mockDocumentWithTwoFile]
    documentsApi.runPipeline.mockImplementationOnce(() => Promise.reject(new Error('mockError')))
    expectOnErrorAfterUploadsComplete(documents, (doc) => {
      expect(doc).toEqual(documents[0])
      done()
    })
  })

  const expectOnProgressAfterUploadsComplete = (documents, expectForProgress) => {
    const uploader = new DocumentSyncUploadService(
      (document, file, percent) => {
        expectForProgress(document, file, percent)
      },
      onDocumentError,
      onDocumentSuccess,
    )
    uploader.upload(documents)
  }

  it('should call onFileProgress callback with correct arguments (document, file, percent)', (done) => {
    const mockEvent = { percent: 99 }
    documentsApi.createDocumentLegacy.mockImplementationOnce((pageFile, data, onSuccess, onError, onProgress) => {
      onProgress(mockEvent)
    })

    expectOnProgressAfterUploadsComplete(documents, (document, file, percent) => {
      expect(document).toEqual(documents[0])
      expect(file).toEqual(documents[0].files[0])
      expect(percent).toEqual(mockEvent.percent)
      done()
    })
  })
})
