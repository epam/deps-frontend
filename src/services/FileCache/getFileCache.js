
import { FileStaticCache } from './FileStaticCache'
import { FileWorkerCache } from './FileWorkerCache'
import { IndexedDbService } from './IndexedDbService'

const getFileCache = () => {
  if (window.Worker) {
    const worker = new Worker(new URL('./WebWorker', import.meta.url), {
      type: 'module',
    })
    return new FileWorkerCache(worker)
  }

  return new FileStaticCache(IndexedDbService)
}

export const FileCache = getFileCache()
