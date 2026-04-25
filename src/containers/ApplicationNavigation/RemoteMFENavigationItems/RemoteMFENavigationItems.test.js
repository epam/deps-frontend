
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import { Menu } from '@/components/Menu'
import { MFEPageConfig } from '@/models/MFEPageConfig'
import { render } from '@/utils/rendererRTL'
import { RemoteMFENavigationItems } from './RemoteMFENavigationItems'

const mockTitle = 'mockTitle'

const mockMFEPages = [
  new MFEPageConfig({
    path: '/mockPath',
    icon: <div>Icon</div>,
    title: mockTitle,
  }),
]

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/ModuleLoader', () => ({
  ...jest.requireActual('@/containers/ModuleLoader'),
  ModuleLoader: ({ children }) => {
    return children(mockMFEPages)
  },
}))

test('show correct MFE menu item when the MFE module was loaded', async () => {
  render(
    <Menu>
      <RemoteMFENavigationItems />
    </Menu>,
  )

  await waitFor(() => {
    expect(screen.getByText(mockTitle)).toBeInTheDocument()
  })
})
