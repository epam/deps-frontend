
import has from 'lodash/has'
import { apiMap } from '@/utils/apiMap'
import { jsonTryParse } from '@/utils/jsonTryParse'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'

const TOKEN_DATA_KEY = 'tokenData'
const HOUR = 3_600_000

const getToken = () => {
  const tokenData = sessionStorageWrapper.getItem(TOKEN_DATA_KEY)
  return jsonTryParse(tokenData)
}

const isValid = (data) => (
  data &&
  has(data, 'token') &&
  has(data, 'exp') &&
  typeof data.token === 'string' &&
  typeof data.exp === 'number' &&
  data.token.length > 0 &&
  data.exp > Date.now()
)

const fetchToken = async (apiGet) => {
  const { token } = await apiGet(apiMap.apiGatewayV2.v5.crossSiteRequestForgery())
  const newTokenData = {
    token,
    exp: Date.now() + HOUR,
  }
  sessionStorageWrapper.setItem(TOKEN_DATA_KEY, JSON.stringify(newTokenData))
  return token
}

const getCSRFToken = async (apiGet) => {
  const tokenData = getToken()

  if (!isValid(tokenData) && apiGet) {
    return fetchToken(apiGet)
  }

  return tokenData?.token
}

export { getCSRFToken }
