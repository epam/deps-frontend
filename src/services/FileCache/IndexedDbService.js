
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { openDB } from 'idb'

dayjs.extend(duration)

const DB_NAME = 'documentBlobsCache'
const STORE_NAME = 'blobs'
const DB_VERSION = 1
const DB_KEY_PATH = 'url'
const BLOB_DURATION_UNIT = 24
const BLOB_DURATION_MEASUREMENT = 'hours'
const PERIOD_MILLISECOND = 'millisecond'
const blobLifetime = (
  dayjs
    .duration(BLOB_DURATION_UNIT, BLOB_DURATION_MEASUREMENT)
    .asMilliseconds()
)

const getTimeExpiration = () => (
  dayjs()
    .add(blobLifetime, PERIOD_MILLISECOND)
    .valueOf()
)

const DbMode = {
  READ_WRITE: 'readwrite',
}

let db

class IndexedDbService {
  static inFlightRequests = {}

  static pendingOperations = new Map()

  static init = async () => {
    const base = await openDB(
      DB_NAME,
      DB_VERSION,
      {
        upgrade: (db) => {
          db.createObjectStore(STORE_NAME, {
            keyPath: DB_KEY_PATH,
          })
        },
      })

    db = base

    IndexedDbService.clearExpiredBlobs()
  }

  static getBlob = async (key) => {
    if (this.pendingOperations.has(key)) {
      await this.pendingOperations.get(key)
      const updatedStore = db.transaction(STORE_NAME).objectStore(STORE_NAME)
      const updatedValue = await updatedStore.get(key)
      return updatedValue?.blob
    }

    const store = db.transaction(STORE_NAME).objectStore(STORE_NAME)
    const value = await store.get(key)

    return value?.blob
  }

  static saveBlob = async (data) => {
    const pendingPromise = (async () => {
      const tx = db.transaction(STORE_NAME, DbMode.READ_WRITE)
      const store = tx.objectStore(STORE_NAME)
      await store.put({
        ...data,
        expiresAt: getTimeExpiration(),
      })
      await tx.done
    })()

    this.pendingOperations.set(data.url, pendingPromise)

    try {
      await pendingPromise
    } finally {
      this.pendingOperations.delete(data.url)
    }
  }

  static requestAndStore = async ({ urls, requestCallback }) => {
    const response = {}

    for (const url of urls) {
      const cachedBlob = await IndexedDbService.getBlob(url)

      if (cachedBlob) {
        response[url] = cachedBlob
      } else {
        if (!this.inFlightRequests[url]) {
          this.inFlightRequests[url] = requestCallback(url).then((r) => r.blob())
        }

        const blob = await this.inFlightRequests[url]

        await IndexedDbService.saveBlob({
          url,
          blob,
        })

        response[url] = blob

        delete this.inFlightRequests[url]
      }
    }

    return response
  }

  static clearExpiredBlobs = async () => {
    const tx = db.transaction(STORE_NAME, DbMode.READ_WRITE)
    const store = tx.objectStore(STORE_NAME)
    let cursor = await store.openCursor()
    const now = dayjs().valueOf()

    while (cursor) {
      if (now > cursor.value.expiresAt) {
        await cursor.delete()
      }
      cursor = await cursor.continue()
    }

    await tx.done
  }
}

IndexedDbService.init()

export {
  IndexedDbService,
}
