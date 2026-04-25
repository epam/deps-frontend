/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { DocumentInformationButton } from './DocumentInformationButton'

jest.mock('@/containers/DocumentInformation', () => mockComponent('DocumentInformation'))
jest.mock('@/utils/env', () => mockEnv)

test('opens drawer after click on a button', async () => {
  render(<DocumentInformationButton />)

  const button = screen.getByRole('button', {
    name: localize(Localization.DOCUMENT_INFORMATION),
  })

  await userEvent.click(button)

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
})

test('closes the opened drawer after click outside drawer', async () => {
  render(<DocumentInformationButton />)

  const button = screen.getByRole('button', {
    name: localize(Localization.DOCUMENT_INFORMATION),
  })

  await userEvent.click(button)

  const drawer = screen.getByTestId('drawer')
  const mask = drawer.querySelector('.ant-drawer-mask')

  await userEvent.click(mask)

  expect(drawer).not.toHaveClass('ant-drawer-open')
})
