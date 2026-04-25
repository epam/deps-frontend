
import { ENV } from '@/utils/env'
import { DocumentAsyncUploadService } from './DocumentAsyncUploadService'
import { DocumentSyncUploadService } from './DocumentSyncUploadService'

export const getDocumentUploadService = (...args) => {
  if (ENV.FEATURE_TRIAL_VERSION) {
    return new DocumentSyncUploadService(...args)
  }

  return new DocumentAsyncUploadService(...args)
}
