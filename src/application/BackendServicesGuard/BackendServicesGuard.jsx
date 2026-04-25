
import { useEffect, useState } from 'react'
import { useFetchServicesQuery } from '@/apiRTK/servicesApi'
import { Spin } from '@/components/Spin'
import { Localization, localize } from '@/localization/i18n'
import { BackendServicesManager } from '@/services/BackendServicesManager'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import { notifyWarning } from '@/utils/notification'
import { childrenShape } from '@/utils/propTypes'
import { goTo } from '@/utils/routerActions'

export const BackendServicesGuard = ({ children }) => {
  const [areChildrenVisible, setAreChildrenVisible] = useState(false)

  const {
    data: servicesConfig,
    isFetching,
    isError,
  } = useFetchServicesQuery({}, {
    skip: !ENV.FEATURE_SERVICE_AVAILABILITY_CHECK,
  })

  useEffect(() => {
    const setServicesEnvs = () => {
      const { missed, deployed } = servicesConfig ?? {}

      if (missed && Object.values(missed).length) {
        return goTo(navigationMap.error.missedCoreServices(), missed)
      }

      deployed && BackendServicesManager.setEnvs(servicesConfig.deployed)

      isError && notifyWarning(localize(Localization.DEPLOYED_SERVICES_MONITORING_OFF))

      setAreChildrenVisible(true)
    }

    !isFetching && setServicesEnvs()
  }, [isError, isFetching, servicesConfig])

  if (isFetching || !areChildrenVisible) {
    return <Spin.Centered spinning />
  }

  return children
}

BackendServicesGuard.propTypes = {
  children: childrenShape,
}
