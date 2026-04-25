
import { AddBatchDrawer } from '@/containers/ManageBatch/AddBatchDrawer'
import { UploadDocumentsDrawer } from '@/containers/UploadDocumentsDrawer'
import { UploadFilesDrawer } from '@/containers/UploadFilesDrawer'
import { UploadSplittingFilesDrawer } from '@/containers/UploadSplittingFilesDrawer'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { UploadType } from './constants'

export const UploadTypeToRender = {
  [UploadType.FILES]: UploadFilesDrawer,
  [UploadType.DOCUMENT]: UploadDocumentsDrawer,
  [UploadType.BATCH]: AddBatchDrawer,
  [UploadType.SPLITTING_FILE]: UploadSplittingFilesDrawer,
}

export const UploadTypeToOptions = {
  ...(ENV.FEATURE_FILES && {
    [UploadType.FILES]: {
      title: localize(Localization.UPLOAD_TYPE_FILE_TITLE),
      description: localize(Localization.UPLOAD_TYPE_FILE_DESCRIPTION),
    },
  }),
  [UploadType.DOCUMENT]: {
    title: localize(Localization.DOCUMENT),
    description: localize(Localization.UPLOAD_TYPE_DOCUMENT_DESCRIPTION),
  },
  ...(ENV.FEATURE_FILES_BATCH && {
    [UploadType.BATCH]: {
      title: localize(Localization.UPLOAD_TYPE_BATCH_TITLE),
      description: localize(Localization.UPLOAD_TYPE_BATCH_DESCRIPTION),
    },
  }),
  ...(ENV.FEATURE_PDF_SPLITTING && ENV.FEATURE_FILES_BATCH && {
    [UploadType.SPLITTING_FILE]: {
      title: localize(Localization.UPLOAD_TYPE_SPLITTING_FILE_TITLE),
      description: localize(Localization.UPLOAD_TYPE_SPLITTING_FILE_DESCRIPTION),
    },
  }),
}
