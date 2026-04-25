/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { AddCommentsButton } from './AddCommentsButton'

jest.mock('@/containers/DocumentComments', () => mockComponent('DocumentComments'))
jest.mock('@/utils/env', () => mockEnv)

test('opens drawer after click on a button', async () => {
  render(<AddCommentsButton />)

  const button = screen.getByRole('button', {
    name: localize(Localization.ADD_COMMENT_ACTION),
  })

  await userEvent.click(button)

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.COMMENTS_TITLE))).toBeInTheDocument()
})

test('closes the opened drawer after click outside drawer', async () => {
  render(<AddCommentsButton />)

  const button = await screen.findByRole('button', {
    name: localize(Localization.ADD_COMMENT_ACTION),
  })

  await userEvent.click(button)

  const drawer = screen.getByTestId('drawer')
  const mask = drawer.querySelector('.ant-drawer-mask')

  await userEvent.click(mask)

  expect(drawer).not.toHaveClass('ant-drawer-open')
})
