
import { documentsApi } from '@/api/documentsApi'

const MAX_SIMULTANEOUS_REQUESTS = 3

const REQUEST_TYPE = {
  CREATE_UPLOAD_SESSION: 'CREATE_UPLOAD_SESSION',
  UPLOAD_FILE: 'UPLOAD_FILE',
  START_PROCESSING: 'START_PROCESSING',
}

/**
 * Creates object of arguments for the particular request.
 * @returns arguments object for the particular request.
 */
const createRequestArgsObject = (type, document, file, partOfBatch = false, runPipeline = false) => ({
  type,
  document,
  file,
  runPipeline,
  partOfBatch,
  documentId: null,
  batchId: null,
  abort: null,
})

/**
 * Represents a Document Uploader.
 * @constructor
 * @callback onFileProgress
 * @callback onDocumentError
 * @callback onDocumentSuccess
 * @param {onFileProgress} onFileProgress - handler for file upload progress.
 * @param {onDocumentError} onDocumentError - handler for document upload error.
 * @param {onDocumentSuccess} onDocumentSuccess - handler for document upload success.
 * these params can be bound in the particular place, where instance of the DocumentUploader is used.
 */
function DocumentAsyncUploadService (onFileProgress, onDocumentError, onDocumentSuccess) {
  this.onFileProgress = onFileProgress
  this.onDocumentError = onDocumentError
  this.onDocumentSuccess = onDocumentSuccess

  /**
   * queue - array of objects with request arguments.
   */
  let queue = []

  /**
   * pending - array of objects with request arguments which are executing now.
   */
  let pending = []

  /**
   * Looks for the START_PROCESSING request that can be executed.
   * START_PROCESSING request can be executed only if there are
   * no pending or queued requests, for the same document.
   * @returns START_PROCESSING request or undefined.
   */
  const getNextStartProcessingRequest = () => {
    return queue.find((request) => {
      if (request.type !== REQUEST_TYPE.START_PROCESSING) {
        return false
      }

      const isWaiting = queue.find((r) => r !== request && r.document === request.document)
      const isPending = pending.find((r) => r.document === request.document)
      return !isWaiting && !isPending
    })
  }

  /**
   * Looks for the next request that can be executed.
   * CREATE_UPLOAD_SESSION can be executed without any condition.
   * UPLOAD_FILE request can be executed only if it's not a part of the batch or batchId already retrieved.
   * START_PROCESSING request can be executed if there are no other request for same document are in the queue.
   * Prioritizes START_PROCESSING of all other requests.
   * @returns request that can be executed or undefined.
   */
  const getNextRequest = () => {
    const startProcessingRequest = getNextStartProcessingRequest()
    if (startProcessingRequest) {
      return startProcessingRequest
    }

    for (let i = 0; i < queue.length; i++) {
      const request = queue[i]
      if (request.type === REQUEST_TYPE.CREATE_UPLOAD_SESSION) {
        return request
      }

      if (request.type === REQUEST_TYPE.UPLOAD_FILE && (!request.partOfBatch || request.batchId)) {
        return request
      }
    }
  }

  /**
   * Creates session for the document upload on the server.
   * OnSuccess: updates other requests in the queue, related to the same document, with batchId.
   * OnError: removes requests from the queue, related to the same document and notifies about failure.
   * @returns Promise for this operation that always resolves
   */
  const createSession = async (request) => {
    try {
      const { batchId } = await documentsApi.createMultiUploadSession()
      queue = queue.map((r) => r.document === request.document ? {
        ...r,
        batchId,
      } : r)
    } catch (e) {
      queue = queue.filter((r) => r.document !== request.document)
      this.onDocumentError && this.onDocumentError(request.document, e)
    }
  }

  /**
   * Uploads a file of the document to the server
   * OnSuccess: updates other requests in the queue, related to the same document, with documentId.
   * OnError: cancel any pending requests that are cancellable from pending queue,
   * removes requests from the pending queue, related to the same document,
   * removes requests from the queue, related to the same document and
   * notifies about failure
   * OnProgress: notifies about the upload progress.
   * @returns Promise for this operation that always resolves
   */
  const uploadFile = (request) => {
    const { batchId, document, file, runPipeline } = request

    const data = {
      assignedToMe: document.assignedToMe,
      batchId,
      documentName: document.name,
      groupId: document.groupId,
      documentType: document.documentType,
      engine: document.engine,
      llmType: document.llmType,
      labelIds: document.labelIds,
      parsingFeatures: document.parsingFeatures,
      needsExtraction: document.needsExtraction,
      needsUnifier: document.needsUnifier,
      needsParsing: document.needsParsing,
    }

    return new Promise((resolve) => {
      request.abort = documentsApi.createDocumentLegacy(
        file,
        data,
        (response) => {
          const documentId = response && response.id
          queue = queue.map((r) => r.document === document ? {
            ...r,
            documentId,
          } : r)
          runPipeline && this.onDocumentSuccess({
            ...document,
            documentId,
          })
          resolve()
        },
        (e) => {
          pending
            .filter((r) => r.document === document && r.abort)
            .forEach((req) => req.abort.then((abort) => abort()))

          pending = pending.filter((r) => r.document !== document)
          queue = queue.filter((r) => r.document !== document)
          this.onDocumentError && this.onDocumentError(document, e)
          resolve()
        },
        (event) => {
          this.onFileProgress && this.onFileProgress(document, file, event.percent)
        },
      )
    })
  }

  /**
   * Starts processing of the document
   * OnSuccess: notifies about document success
   * OnError: notifies about failure
   * @returns Promise for this operation that always resolves
   */
  const startProcessing = async (request) => {
    try {
      const documentIds = [request.documentId]
      await documentsApi.runPipeline(documentIds, request.document.extractData)
      this.onDocumentSuccess && this.onDocumentSuccess(request.document)
    } catch (e) {
      this.onDocumentError && this.onDocumentError(request.document, e)
    }
  }

  /**
   * Calls to the proper request based on the request.type field
   * @returns Promise for this operation that always resolves
   */
  const executeRequest = (request) => {
    switch (request.type) {
      case REQUEST_TYPE.CREATE_UPLOAD_SESSION:
        return createSession(request) // '/multi-upload-session' route
      case REQUEST_TYPE.UPLOAD_FILE:
        return uploadFile(request) // '/document-file' route
      case REQUEST_TYPE.START_PROCESSING:
        return startProcessing(request) // '/run-pipeline' route
      default:
        throw new Error(`${request.type} request type was not expected`)
    }
  }

  /**
   * Executes request from the queue, but limits number of the pending request by MAX_SIMULTANEOUS_REQUESTS
   * Gets new request for the queue that can be executed
   * If there is nothing to execute, returns, otherwise
   * - Removes one request from the queue
   * - Pushes this request to the pending queue
   * - Initiation the request
   * - Calls itself if we can execute more requests in parallel
   * - Waits for the request to be completed
   * - Removes finished request from the pending requests queue
   * - Calls to itself to start all over again
   */
  const execute = async () => {
    const request = getNextRequest()
    if (!request) {
      return
    }

    queue = queue.filter((r) => r !== request)

    pending.push(request)
    const pendingRequest = executeRequest(request)
    if (pending.length < MAX_SIMULTANEOUS_REQUESTS) {
      execute()
    }

    await pendingRequest

    pending = pending.filter((r) => r !== request)

    execute()
  }

  /**
   * Creates array of the request objects based on the number of the documents pages
   * @returns array with two requests (UPLOAD_FILE + START_PROCESSING) for single page document
   * array with n + 2 requests (CREATE_UPLOAD_SESSION + n * UPLOAD_FILE + START_PROCESSING)
   * for document with n pages
   */
  const mapDocumentToRequests = (document) => {
    const [file] = document.files
    const isMultiPage = document.files.length !== 1

    if (!isMultiPage) {
      return [createRequestArgsObject(REQUEST_TYPE.UPLOAD_FILE, document, file, false, true)]
    }

    return [
      createRequestArgsObject(REQUEST_TYPE.CREATE_UPLOAD_SESSION, document, file),
      ...document.files.map((file) => createRequestArgsObject(REQUEST_TYPE.UPLOAD_FILE, document, file, true)),
      createRequestArgsObject(REQUEST_TYPE.START_PROCESSING, document, file),
    ]
  }

  /**
   * Only one exposed function to start the upload
   */
  this.upload = (documents) => {
    queue = documents.reduce((acc, document) => [
      ...acc,
      ...mapDocumentToRequests(document),
    ], [])

    pending = []
    execute()
  }
}

export {
  DocumentAsyncUploadService,
}
