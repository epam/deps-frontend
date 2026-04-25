
import { mockUuid } from '@/mocks/mockUuid'
import notification from 'antd/es/notification'
import { CheckCircleIcon } from '@/components/Icons/CheckCircleIcon'
import { CloseCircleIcon } from '@/components/Icons/CloseCircleIcon'
import { InfoIcon } from '@/components/Icons/InfoIcon'
import { LoadingIcon } from '@/components/Icons/LoadingIcon'
import { WarningIcon } from '@/components/Icons/WarningIcon'
import { theme } from '@/theme/theme.default'
import {
  notifyInfo,
  notifyWarning,
  notifyError,
  notifySuccess,
  notifyProgress,
  notifyRequest,
} from './notification'

jest.mock('uuid', () => mockUuid)
jest.mock('antd/es/notification', () => ({
  ...jest.requireActual('antd/es/notification'),
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
  open: jest.fn(),
  config: jest.fn(),
  close: jest.fn(),
}))

const description = 'Mock Description'
const delay = 300
const localisationConfig = {
  fetching: 'fetching message',
  success: 'success message',
  warning: 'warning message',
}

describe('Utils: notification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should call notification.info once with correct args', () => {
    const iconProps = {
      color: theme.color.primary2,
      size: 12,
    }
    const message = 'Mock Message'

    notifyInfo(message, description)
    expect(notification.info).nthCalledWith(1, {
      key: `${message}${description}`,
      description,
      message,
      icon: <InfoIcon.Filled {...iconProps} />,
    })
  })

  it('should call notification.success once with correct args', () => {
    const message = 'Mock Message 1'

    const icon = <CheckCircleIcon />
    notifySuccess(message, description)
    expect(notification.success).nthCalledWith(1, {
      key: `${message}${description}`,
      description,
      message,
      icon,
    })
  })

  it('should call notification.error once with correct args', () => {
    const message = 'Mock Message 2'
    console.error = jest.fn()
    const icon = <CloseCircleIcon />
    notifyError(message, description)
    expect(notification.error).nthCalledWith(1, {
      key: `${message}${description}`,
      description,
      message,
      icon,
    })
  })

  it('should call notification.warning once with correct args', () => {
    const message = 'Mock Message 3'
    console.warn = jest.fn()
    const icon = <WarningIcon />
    notifyWarning(message, description)
    expect(notification.warning).nthCalledWith(1, {
      key: `${message}${description}`,
      description,
      message,
      icon,
    })
  })

  it('should call notification.open once with correct args after 500ms', () => {
    const message = 'Mock Message 4'
    jest.useFakeTimers()
    const icon = <LoadingIcon />
    notifyProgress(message, delay)
    jest.advanceTimersByTime(200)
    expect(notification.open).not.toHaveBeenCalled()
    jest.advanceTimersByTime(300)
    expect(notification.open).nthCalledWith(1, {
      key: '1',
      icon,
      message,
      duration: 0,
    })
  })

  it('should call notification.success in notifyRequest method', async () => {
    const request = Promise.resolve()
    await notifyRequest(request)(localisationConfig, delay)
    expect(notification.success).nthCalledWith(1, {
      key: localisationConfig.success,
      message: localisationConfig.success,
      description: '',
      icon: <CheckCircleIcon />,
    })
  })

  it('should handle notifyRequest failure correctly', async () => {
    const mockError = new Error('Mock Error Message')
    const request = Promise.reject(mockError)
    try {
      await notifyRequest(request)(localisationConfig, delay)
    } catch (err) {
      expect(notification.warning).nthCalledWith(1, {
        key: localisationConfig.warning,
        message: localisationConfig.warning,
        description: '',
        icon: <WarningIcon />,
      })
      expect(err.message).toBe(mockError.message)
    }
  })
})
