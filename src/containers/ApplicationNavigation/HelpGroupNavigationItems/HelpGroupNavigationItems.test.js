
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import { Menu } from '@/components/Menu'
import { Localization, localize } from '@/localization/i18n'
import { customizationSelector } from '@/selectors/customization'
import { render } from '@/utils/rendererRTL'
import { HelpGroupNavigationItems } from './HelpGroupNavigationItems'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/customization')
jest.mock('@/containers/UserGuideDownloadButton', () => ({
  UserGuideDownloadButton: () => <div data-testid='user-guide' />,
}))

test('show User Guide and Support menu items', async () => {
  customizationSelector.mockImplementationOnce(() => ({
    UserGuideDownloadButton: {
      getUrl: jest.fn((url) => url),
    },
  }))

  render(
    <Menu>
      <HelpGroupNavigationItems />
    </Menu>,
  )

  await waitFor(() => {
    expect(
      screen.getByText(localize(Localization.USER_GUIDE)),
    ).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(
      screen.getByText(localize(Localization.USER_GUIDE)),
    ).toBeInTheDocument()
  })
})
