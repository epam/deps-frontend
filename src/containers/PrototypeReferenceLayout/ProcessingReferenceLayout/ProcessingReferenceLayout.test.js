
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ProcessingReferenceLayout } from './ProcessingReferenceLayout'

jest.mock('@/utils/env', () => mockEnv)

test('show correct text', () => {
  render(
    <ProcessingReferenceLayout />,
  )

  const textBlock = screen.getByText(localize(Localization.REFERENCE_LAYOUT_PROCESSING))

  expect(textBlock).toBeInTheDocument()
})
