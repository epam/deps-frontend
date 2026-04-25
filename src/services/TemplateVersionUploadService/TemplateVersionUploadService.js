
import { templatesApi } from '@/api/templatesApi'

class TemplateVersionUploadService {
  constructor (onFileSuccess, onFileError, onFileProgress) {
    this.onFileSuccess = onFileSuccess
    this.onFileError = onFileError
    this.onFileProgress = onFileProgress
  }

  #getParamsForUpload = (
    {
      templateId,
      file,
      name,
      description,
      markupAutomatically,
    },
    resolve,
    reject,
  ) => ([
    {
      code: templateId,
      file,
      name,
      description,
      markupAutomatically,
    },
    () => {
      this.onFileSuccess()
      resolve()
    },
    () => {
      this.onFileError()
      reject()
    },
    (event) => {
      this.onFileProgress(file, event)
    },
  ])

  uploadTemplateVersion = (params) => new Promise((resolve, reject) => {
    templatesApi.uploadTemplateVersionFile(...this.#getParamsForUpload(params, resolve, reject))
  })
}

export {
  TemplateVersionUploadService,
}
