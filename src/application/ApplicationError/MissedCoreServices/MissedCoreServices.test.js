
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { MissedCoreServices } from './MissedCoreServices'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/ApplicationLogo', () => mockComponent('ApplicationLogo'))

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(() => ({
    state: {
      service: {
        name: 'service',
      },
    },
  })),
}))

test('renders MissedCoreServices component correctly', () => {
  render(<MissedCoreServices />)

  const title = screen.getByText(localize(Localization.MISSED_CORE_SERVICES_INFO))
  const service = screen.getByText('service')

  expect(title).toBeInTheDocument()
  expect(service).toBeInTheDocument()
})
