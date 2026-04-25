
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { LocalBoundary } from './LocalBoundary'

jest.mock('@/utils/env', () => mockEnv)

test('renders localized texts and support link', () => {
  render(<LocalBoundary />)

  const errorMessage = screen.getByText(localize(Localization.DEFAULT_ERROR_MESSAGE))
  const link = screen.getByRole('link', { name: localize(Localization.CONTACT_SUPPORT) })
  const email = `mailto:${mockEnv.ENV.SUPPORT_EMAIL}`

  expect(errorMessage).toBeInTheDocument()
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', email)
})
