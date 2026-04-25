
import { mockDayjs } from '@/mocks/mockDayjs'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ThinkingMessage } from './ThinkingMessage'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('dayjs', () => mockDayjs())

jest.mock('@/components/Icons/ThoughtIcon', () => ({
  ThoughtIcon: () => <span data-testid='thought-icon' />,
}))

jest.mock('@/containers/AiAnswer', () => ({
  AiAnswer: ({ answer, time }) => (
    <div data-testid='ai-answer'>
      <div data-testid='message'>{answer}</div>
      <div data-testid='time'>{time}</div>
    </div>
  ),
}))

test('renders ThinkingMessage component', () => {
  render(<ThinkingMessage />)

  expect(screen.getByTestId('ai-answer')).toBeInTheDocument()
})

test('renders thinking text and ThoughtIcon', () => {
  render(<ThinkingMessage />)

  expect(screen.getByTestId('thought-icon')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.THINKING))).toBeInTheDocument()
})
