
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import i18n from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { render } from '@/utils/rendererRTL'
import { LanguageSwitch } from './LanguageSwitch'

jest.mock('@/utils/env', () => mockEnv)

test('changes language when menu item is clicked', async () => {
  const mockReload = jest.fn()

  delete window.location
  window.location = {
    reload: mockReload,
  }

  render(
    <I18nextProvider i18n={i18n}>
      <LanguageSwitch />
    </I18nextProvider>,
  )

  const enLangButton = screen.getByRole('button', {
    name: 'EN',
  })

  await userEvent.click(enLangButton)

  const menuItems = screen.getAllByRole('menuitem')

  await userEvent.click(menuItems[1], {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  const esLangButton = screen.getByRole('button', {
    name: 'ES',
  })

  expect(esLangButton).toBeInTheDocument()
  expect(mockReload).toHaveBeenCalled()
})
