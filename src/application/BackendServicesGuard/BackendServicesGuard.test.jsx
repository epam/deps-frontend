
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/dom'
import { useFetchServicesQuery } from '@/apiRTK/servicesApi'
import { Localization, localize } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { goTo } from '@/utils/routerActions'
import { BackendServicesGuard } from './BackendServicesGuard'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/servicesApi', () => ({
  useFetchServicesQuery: jest.fn(() => ({
    data: mockResponse,
    isFetching: false,
    isError: false,
  })),
}))

jest.mock('@/utils/notification', () => ({
  notifyWarning: jest.fn(),
}))

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

const mockResponse = {
  deployed: {
    service1: {
      name: 'service1',
    },
    service2: {
      name: 'service2',
    },
  },
  missed: null,
}

const mockContent = 'content'

test('render Spinner if data is fetching', async () => {
  jest.clearAllMocks()

  useFetchServicesQuery.mockReturnValueOnce({
    data: null,
    isFetching: true,
  })

  render(
    <BackendServicesGuard>
      {mockContent}
    </BackendServicesGuard>,
  )

  await waitFor(() => {
    expect(screen.getByTestId('spin')).toBeInTheDocument()
  })
})

test('render children after fetch completion', async () => {
  jest.clearAllMocks()

  render(
    <BackendServicesGuard>
      {mockContent}
    </BackendServicesGuard>,
  )

  await waitFor(() => {
    expect(screen.getByText(mockContent)).toBeInTheDocument()
  })
})

test('calls notifyWarning if request fails with error', async () => {
  jest.clearAllMocks()

  useFetchServicesQuery.mockReturnValueOnce({
    data: null,
    isFetching: false,
    isError: true,
  })

  render(
    <BackendServicesGuard>
      {mockContent}
    </BackendServicesGuard>,
  )

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(
      1,
      localize(Localization.DEPLOYED_SERVICES_MONITORING_OFF),
    )
  })
})

test('calls goTo if there are missed services', async () => {
  jest.clearAllMocks()

  const mockMissedServices = {
    serviceD: {
      name: 'serviceD',
    },
  }

  useFetchServicesQuery.mockReturnValueOnce({
    data: {
      ...mockResponse,
      missed: mockMissedServices,
    },
    isFetching: false,
    isError: false,
  })

  render(
    <BackendServicesGuard>
      {mockContent}
    </BackendServicesGuard>,
  )

  await waitFor(() => {
    expect(goTo).nthCalledWith(1, navigationMap.error.missedCoreServices(), mockMissedServices)
  })
})
