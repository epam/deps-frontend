
import { PublicClientApplication } from '@azure/msal-browser'
import { BatchRequestContent, Client } from '@microsoft/microsoft-graph-client'
import { useRef } from 'react'
import { MimeType } from '@/enums/MimeType'
import { RequestHeader } from '@/enums/RequestHeader'
import { RequestMethod } from '@/enums/RequestMethod'
import { ENV } from '@/utils/env'
import { Permission } from './Permission'

const AvailableScopes = ['Files.ReadWrite.All', 'User.ReadWrite.All']
const BATCH_API_URL = '/$batch'

const msalConfig = {
  auth: {
    authority: 'https://login.microsoftonline.com/consumers',
    clientId: ENV.ONE_DRIVE_CLIENT_ID,
    redirectUri: window.location.origin,
  },
}

const permission = new Permission({
  roles: ['read'],
  sendInvitation: false,
  requireSignIn: true,
  recipientsEmails: [ENV.ONE_DRIVE_SERVICE_ACCOUNT_EMAIL],
})

const createPermissionRequest = (id) => ({
  id,
  request: new Request(
    `/me/drive/items/${id}/invite`,
    {
      method: RequestMethod.POST,
      body: JSON.stringify(permission),
      headers: {
        [RequestHeader.CONTENT_TYPE]: MimeType.APPLICATION_JSON,
      },
    },
  ),
})

const useOneDriveApi = () => {
  const msal = useRef(
    new PublicClientApplication(msalConfig),
  )
  const client = useRef(Client)

  const initApi = async () => {
    await msal.current.initialize()

    const token = await getToken(AvailableScopes)

    client.current = Client.init({
      authProvider: (done) => {
        done(null, token)
      },
    })
  }

  const getToken = async (scopes) => {
    const authParams = { scopes }

    let accessToken

    try {
      const response = await msal.current?.acquireTokenSilent(authParams)
      accessToken = response.accessToken
    } catch {
      const authResponse = await msal.current?.loginPopup(authParams)
      msal.current?.setActiveAccount(authResponse.account)

      if (authResponse.idToken) {
        const tokenResponse = await msal.current?.acquireTokenSilent(authParams)
        accessToken = tokenResponse.accessToken
      }
    }

    return accessToken
  }

  const sharePermissions = async (filesIds) => {
    const batchRequestContent = new BatchRequestContent(
      filesIds.map((id) => createPermissionRequest(id)),
    )

    const content = await batchRequestContent.getContent()

    await client.current?.api(BATCH_API_URL).post(content)
  }

  return {
    sharePermissions,
    getToken,
    initApi,
  }
}

export {
  useOneDriveApi,
}
