import { WebStorageStateStore } from 'oidc-client-ts'
import { jsonTryParse } from '@/utils/jsonTryParse'

class OidcStore extends WebStorageStateStore {
  constructor (store = window.localStorage) {
    super({ store })
    this.state = store
  }

  getSync = (key) => jsonTryParse(this.state.getItem(key))
}

export {
  OidcStore,
}
