
import { ResponseType } from '@/enums/ResponseType'
import { apiRequest } from '@/utils/apiRequest'

const requestCallback = (url) => apiRequest(url, {
  responseType: ResponseType.BLOB,
}).then((blob) => ({
  blob: () => Promise.resolve(blob),
}))

class FileStaticCache {
  constructor (dbService) {
    this.dbService = dbService
  }

  store = (key, value) => this.dbService.saveBlob({
    url: key,
    blob: value,
  })

  requestAndStore = (urls) => this.dbService.requestAndStore({
    urls,
    requestCallback,
  })

  get = (url) => this.dbService.getBlob(url)
}

export {
  FileStaticCache,
}
