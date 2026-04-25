
import { KnownBackendService } from '@/enums/KnownBackendService'
import { KnownServiceToFeatureMap } from './constants'

class BackendServicesManager {
  #servicesEnvs

  #featuresEnvs

  #getDisabledFeaturesEnvs = (servicesEnvs) => {
    const disabledFeatures = {}

    servicesEnvs.forEach((service) => {
      if (KnownServiceToFeatureMap[service]) {
        const features = KnownServiceToFeatureMap[service]

        features.forEach((feature) => {
          disabledFeatures[feature] = false
        })
      }
    })

    return disabledFeatures
  }

  #getServicesEnvs = (deployedServices) => {
    const services = {}

    Object.values(KnownBackendService).forEach((service) => {
      services[service] = !!deployedServices[service]
    })

    return services
  }

  getServiceEnv = (name) => this.#servicesEnvs?.[name]

  getFeatureEnv = (name) => this.#featuresEnvs?.[name]

  setEnvs = (deployedServices) => {
    const services = this.#getServicesEnvs(deployedServices)

    const disabledServices = (
      Object.entries(services)
        .map(([key, value]) => !value && key)
        .filter(Boolean)
    )

    this.#servicesEnvs = services
    this.#featuresEnvs = this.#getDisabledFeaturesEnvs(disabledServices)
  }
}

const manager = new BackendServicesManager()

export {
  manager as BackendServicesManager,
}
