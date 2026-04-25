
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ColorHint } from './ColorHint'

jest.mock('@/utils/env', () => mockEnv)

test('should render correct badges with labels', () => {
  render(<ColorHint />)

  const labels = [
    Localization.ASSIGNED,
    Localization.UNASSIGNED,
    Localization.ACTIVE,
  ]

  labels.forEach((label) => {
    expect(screen.getByText(localize(label))).toBeInTheDocument()
  })
})
