
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { render } from '@/utils/rendererRTL'
import { LanguageProvider } from './LanguageProvider'

jest.mock('@/utils/env', () => mockEnv)

const mockText = 'Test'

test('renders children correctly', () => {
  render(
    <LanguageProvider>
      <div>{mockText}</div>
    </LanguageProvider>,
  )

  const childrenText = screen.getByText(mockText)

  expect(childrenText).toBeInTheDocument()
})
