
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { GoToAzureButton } from './GoToAzureButton'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/ExternalLinkAlt', () => ({
  ExternalLinkAltIcon: () => <div data-testid='external-link-icon' />,
}))

const AZURE_STUDIO_LINK = 'https://documentintelligence.ai.azure.com/studio'

test('displays go to azure button correctly with default text', async () => {
  render(
    <GoToAzureButton />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.AZURE_STUDIO),
  })
  const externalIcon = screen.getByTestId('external-link-icon')

  expect(button).toBeInTheDocument()
  expect(externalIcon).toBeInTheDocument()
})

test('displays go to azure button correctly when text prop is passed', async () => {
  const buttonText = 'mockButtonText'

  render(
    <GoToAzureButton text={buttonText} />,
  )

  const button = screen.getByRole('button', {
    name: buttonText,
  })
  const externalIcon = screen.getByTestId('external-link-icon')

  expect(button).toBeInTheDocument()
  expect(externalIcon).toBeInTheDocument()
})

test('calls window.open when user clicks on the button', async () => {
  window.open = jest.fn()

  render(
    <GoToAzureButton />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.AZURE_STUDIO),
  })

  await userEvent.click(button)

  expect(window.open).nthCalledWith(1, AZURE_STUDIO_LINK, '_blank')
})
