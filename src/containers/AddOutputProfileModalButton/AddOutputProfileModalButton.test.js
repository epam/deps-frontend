
import { mockEnv } from '@/mocks/mockEnv'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { AddOutputProfileModalButton } from './AddOutputProfileModalButton'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./AddOutputProfileByExtractorSection', () => ({
  AddOutputProfileByExtractorSection: () => <div data-testid="add-extractor-section" />,
}))

jest.mock('./AddOutputProfileByLayoutSection', () => ({
  AddOutputProfileByLayoutSection: () => <div data-testid="add-layout-section" />,
}))

const clickTriggerButton = async () => {
  const button = screen.getByRole('button', {
    name: localize(Localization.ADD_OUTPUT_PROFILE),
  })

  await userEvent.click(button)
}

test('shows modal with correct title and both profile sections after clicking trigger button', async () => {
  render(<AddOutputProfileModalButton disabled={false} />)

  await clickTriggerButton()

  const modal = screen.getByRole('dialog')
  const modalTitle = within(modal).getByText(localize(Localization.SELECT_PROFILE_TYPE))

  expect(modalTitle).toBeInTheDocument()
  expect(screen.getByTestId('add-extractor-section')).toBeInTheDocument()
  expect(screen.getByTestId('add-layout-section')).toBeInTheDocument()
})
