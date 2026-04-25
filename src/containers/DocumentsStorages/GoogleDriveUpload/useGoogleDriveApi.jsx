
import { useEffect, useCallback } from 'react'
import { useDynamicScript } from '@/hooks/useDynamicScript'
import { ENV } from '@/utils/env'
import { Permission } from './Permission'

const DISCOVERY_REST_URL = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
const GOOGLE_API_SCRIPT = 'https://apis.google.com/js/api.js'

const permission = new Permission({
  role: 'reader',
  type: 'user',
  emailAddress: ENV.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL,
})

const useGoogleDriveApi = () => {
  const { ready: isGapiReady } = useDynamicScript(GOOGLE_API_SCRIPT)

  useEffect(() => {
    const initClient = () => {
      isGapiReady && window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: ENV.GOOGLE_DRIVE_API_KEY,
          clientId: ENV.GOOGLE_DRIVE_CLIENT_ID,
          discoveryDocs: [DISCOVERY_REST_URL],
        })
      })
    }

    initClient()
  }, [isGapiReady])

  const sharePermission = useCallback(async ({
    filesId,
    sendNotificationEmail = false,
  }) => {
    const {
      role,
      type,
      emailAddress,
    } = permission
    const batch = window.gapi.client.newBatch()
    const requests = filesId.map((fileId) => (
      window.gapi.client.drive.permissions.create({
        fileId,
        sendNotificationEmail,
        role,
        type,
        emailAddress,
      })
    ))

    requests.forEach((request) => {
      batch.add(request)
    })

    return new Promise((resolve, reject) => {
      batch.execute((result) => (
        result.error ? reject(result.error) : resolve(result)),
      )
    })
  }, [])

  return {
    sharePermission,
  }
}

export {
  useGoogleDriveApi,
}
