
import { mockLocalStorageWrapper } from '@/mocks/mockLocalStorageWrapper'
import { KnownBackendService } from '@/enums/KnownBackendService'
import { BackendServicesManager } from './BackendServicesManager'
import { KnownServiceToFeatureMap } from './constants'

jest.mock('@/utils/localStorageWrapper', () => mockLocalStorageWrapper())

const mockDeployedServices = (
  Object.values(KnownBackendService)
    .reduce((acc, service) => {
      acc[service] = {
        name: service.toUpperCase(),
      }
      return acc
    }, {})
)

test('sets backendServicesEnvs and connectedFeaturesEnvs correctly', () => {
  BackendServicesManager.setEnvs(mockDeployedServices)

  expect(BackendServicesManager.getServiceEnv(KnownBackendService.AI_FUSION)).toBe(true)
})

test('adds connectedFeatures if there are not deployed services', () => {
  const { tables, ...rest } = mockDeployedServices

  BackendServicesManager.setEnvs(rest)

  const connectedFeatures = KnownServiceToFeatureMap[KnownBackendService.TABLES]

  connectedFeatures.forEach((feature) => {
    expect(BackendServicesManager.getFeatureEnv(feature)).toBe(false)
  })
})
