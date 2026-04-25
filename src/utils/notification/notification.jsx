
import notification from 'antd/es/notification'
import 'antd/lib/notification/style/index.less'
import { v4 as uuidv4 } from 'uuid'
import { CheckCircleIcon } from '@/components/Icons/CheckCircleIcon'
import { CloseCircleIcon } from '@/components/Icons/CloseCircleIcon'
import { InfoIcon } from '@/components/Icons/InfoIcon'
import { LoadingIcon } from '@/components/Icons/LoadingIcon'
import { WarningIcon } from '@/components/Icons/WarningIcon'
import { Placement } from '@/enums/Placement'
import { theme } from '@/theme/theme.default'

import './notification.css'

notification.config({
  placement: Placement.BOTTOM_RIGHT,
})

const SPINNER_DELAY = 300

const createKey = (message, description = '') => `${message}${description}`

export const notifyProgress = (message, delay = SPINNER_DELAY) => {
  const key = uuidv4()

  const timeout = setTimeout(
    () => {
      notification.open({
        key,
        icon: <LoadingIcon />,
        message,
        duration: 0,
      })
    },
    delay,
  )

  return () => {
    clearTimeout(timeout)
    notification.close(key)
  }
}

export const notifyRequest = (request) => async ({ fetching, success, warning }, delay = SPINNER_DELAY) => {
  const close = notifyProgress(fetching, delay)
  try {
    const result = await request
    close()
    success && notifySuccess(success)
    return result
  } catch (e) {
    close()
    warning && notifyWarning(warning)
    throw e
  }
}

export const notifySuccess = (message, description = '') => notification.success({
  key: createKey(message, description),
  message,
  description,
  icon: <CheckCircleIcon />,
})

export const notifyError = (message, description = '') => {
  console.error(message)

  return notification.error({
    key: createKey(message, description),
    message,
    description,
    icon: <CloseCircleIcon />,
  })
}

export const notifyWarning = (message, description = '') => {
  console.warn(message)

  return notification.warning({
    key: createKey(message, description),
    message,
    description,
    icon: <WarningIcon />,
  })
}

export const notifyInfo = (message, description = '') => notification.info({
  key: createKey(message, description),
  message,
  description,
  icon: (
    <InfoIcon.Filled
      color={theme.color.primary2}
      size={12}
    />
  ),
})
