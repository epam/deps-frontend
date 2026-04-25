
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { NotConfiguredState } from './NotConfiguredState'

jest.mock('@/utils/env', () => mockEnv)

test('renders correctly with warning message', () => {
  render(<NotConfiguredState />)

  const warningText = screen.getByText(
    localize(Localization.PROMPT_CALIBRATION_STUDIO_NOT_CONFIGURED),
  )

  expect(warningText).toBeInTheDocument()
})
