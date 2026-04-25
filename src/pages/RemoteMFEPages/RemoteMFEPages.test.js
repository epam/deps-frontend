
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MFEPageConfig } from '@/models/MFEPageConfig'
import { render } from '@/utils/rendererRTL'
import { RemoteMFEPages } from './RemoteMFEPages'

const mockMFEPages = [
  new MFEPageConfig({
    path: '/mockPath1',
    component: <div>Mock Component 1</div>,
  }),
  new MFEPageConfig({
    path: '/mockPath2',
    component: <div>Mock Component 2</div>,
  }),
]

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Route: ({ children }) => children,
}))

jest.mock('@/containers/ModuleLoader', () => ({
  ...jest.requireActual('@/containers/ModuleLoader'),
  ModuleLoader: ({ children }) => {
    return children(mockMFEPages)
  },
}))

test('show correct pages when the MFE module was loaded', async () => {
  render(
    <MemoryRouter>
      <RemoteMFEPages />
    </MemoryRouter>,
  )

  expect(screen.getByText('Mock Component 1')).toBeInTheDocument()
  expect(screen.getByText('Mock Component 2')).toBeInTheDocument()
})
