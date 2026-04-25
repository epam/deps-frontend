
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { render } from '@/utils/rendererRTL'
import { EmptyState } from './EmptyState'

jest.mock('@/utils/env', () => mockEnv)

test('renders empty state title', () => {
  const mockTitle = 'Nothing here'
  render(<EmptyState title={mockTitle} />)
  expect(screen.getByText(mockTitle)).toBeInTheDocument()
})
