import { UserManager, Log } from 'oidc-client-ts'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import { OidcStore } from './OidcStore'

if (ENV.FEATURE_OIDC_LOG_LEVEL) {
  Log.setLogger(console)
  Log.setLevel(ENV.FEATURE_OIDC_LOG_LEVEL)
}

const realmPostfix = ENV.AUTH_REALM
  ? `/auth/realms/${ENV.AUTH_REALM}`
  : ''

const AUTHORITY = `${ENV.AUTH_BASE_URL}${realmPostfix}`

const ResponseType = {
  CODE: 'code',
  ID_TOKEN: 'id_token',
  TOKEN: 'token',
}

const OidcConfigKey = {
  AUTHORITY: 'authority',
  CLIENT_ID: 'client_id',
  POST_LOGOUT_REDIRECT_URI: 'post_logout_redirect_uri',
  REDIRECT_URI: 'redirect_uri',
  RESPONSE_TYPE: 'response_type',
  SCOPE: 'scope',
  SILENT_REDIRECT_URL: 'silent_redirect_uri',
  USER_STORE: 'userStore',
}

const oidcWebStore = new OidcStore(window.localStorage)

const OidcConfig = {
  [OidcConfigKey.AUTHORITY]: AUTHORITY,
  [OidcConfigKey.CLIENT_ID]: ENV.AUTH_CLIENT_ID,
  [OidcConfigKey.POST_LOGOUT_REDIRECT_URI]: window.location.origin,
  [OidcConfigKey.REDIRECT_URI]: `${window.location.origin}${navigationMap.auth.signInCallback()}`,
  [OidcConfigKey.RESPONSE_TYPE]: ResponseType.CODE,
  [OidcConfigKey.SCOPE]: ENV.AUTH_SCOPE || undefined,
  [OidcConfigKey.SILENT_REDIRECT_URL]: `${window.location.origin}${navigationMap.auth.silentRenew()}`,
  [OidcConfigKey.USER_STORE]: oidcWebStore,
}

const USER_STORE_KEY = `oidc.user:${AUTHORITY}:${ENV.AUTH_CLIENT_ID}`

class Oidc {
  #manager = null

  get #user () {
    const userData = oidcWebStore.getSync(USER_STORE_KEY)
    return userData?.expires_at > Math.round(Date.now() / 1000) ? userData : null
  }

  constructor () {
    this.#manager = new UserManager(OidcConfig)

    this.#manager.events.addAccessTokenExpired(async () => {
      await this.signOut()
    })
  }

  isAuthenticated = () => !!this.#user

  getAccessToken = () => this.#user?.access_token

  signIn = () => this.#manager.signinRedirect()

  signOut = () => this.#manager.signoutRedirect()

  signInRedirectCallback = () => this.#manager.signinRedirectCallback()

  signInSilentCallback = () => this.#manager.signinSilentCallback()
}

export {
  Oidc,
}
