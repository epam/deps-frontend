
import PropTypes from 'prop-types'
import {
  useState,
  useEffect,
  useCallback,
} from 'react'
import { localize, Localization } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import {
  Link,
  LocalBoundary,
  LocalBoundaryText,
  Spin,
} from './ServicesVersionsPage.styles'
import { ServiceVersionInfo } from './ServiceVersionInfo'

const RESOURCE_FRONTEND_VERSION_INFO = {
  buildTag: ENV.SERVICE_INFO_TAG,
  buildDate: ENV.SERVICE_INFO_DATE,
  commitHash: ENV.SERVICE_INFO_HASH,
}

const SUPPORT_EMAIL = `mailto:${ENV.SUPPORT_EMAIL}`

const ServiceVersionCard = ({
  apiRequest,
  serviceName,
}) => {
  const [serviceVersion, setServiceVersion] = useState(null)
  const [serviceError, setServiceError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const getServiceVersion = useCallback(async () => {
    try {
      if (serviceName === localize(Localization.FRONTEND)) {
        return setServiceVersion(
          RESOURCE_FRONTEND_VERSION_INFO,
        )
      }
      const version = await apiRequest?.()
      setServiceVersion(version)
    } catch (error) {
      setServiceError(error)
    } finally {
      setIsLoading(false)
    }
  }, [
    apiRequest,
    serviceName,
  ])

  useEffect(() => {
    getServiceVersion()
  }, [getServiceVersion])

  if (isLoading) {
    return <Spin spinning />
  }

  if (serviceError) {
    return (
      <LocalBoundary key={serviceName}>
        <LocalBoundaryText>
          {localize(Localization.UNAVAILABLE_SERVICE, { service: `${serviceName}` })}
        </LocalBoundaryText>
        <LocalBoundaryText>
          {localize(Localization.PLEASE)}
          <Link href={SUPPORT_EMAIL}>
            {localize(Localization.CONTACT_SUPPORT)}
          </Link>
        </LocalBoundaryText>
      </LocalBoundary>
    )
  }

  return (
    <ServiceVersionInfo
      key={serviceName}
      serviceInfo={serviceVersion}
      serviceName={serviceName}
    />
  )
}

ServiceVersionCard.propTypes = {
  apiRequest: PropTypes.func,
  serviceName: PropTypes.string.isRequired,
}

export {
  ServiceVersionCard,
}
