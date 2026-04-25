
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { InsightsErrorBoundary } from './InsightsErrorBoundary'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./InsightsErrorBoundary.styles', () => ({
  ErrorContainer: ({ children }) => <div data-testid="error-container">{children}</div>,
  ErrorTitle: ({ children }) => <div data-testid="error-title">{children}</div>,
  ErrorMessage: ({ children }) => <div data-testid="error-message">{children}</div>,
}))

const ErrorThrowingComponent = () => {
  throw new Error('Test error')
}

const WorkingComponent = () => <div>Working content</div>

const originalConsoleError = console.error
beforeAll(() => {
  console.error = jest.fn()
})
afterAll(() => {
  console.error = originalConsoleError
})

test('renders children when no error occurs', () => {
  render(
    <InsightsErrorBoundary>
      <WorkingComponent />
    </InsightsErrorBoundary>,
  )

  expect(screen.getByText('Working content')).toBeInTheDocument()
})

test('renders error fallback when child throws error', () => {
  render(
    <InsightsErrorBoundary>
      <ErrorThrowingComponent />
    </InsightsErrorBoundary>,
  )

  expect(screen.getByText(localize(Localization.INSIGHTS_ERROR_TITLE))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.INSIGHTS_ERROR_DESCRIPTION))).toBeInTheDocument()
})

test('catches JSON parsing errors from lazy parsed values', () => {
  const ComponentWithInvalidJSON = () => {
    JSON.parse('invalid json')
    return <div>Should not render</div>
  }

  render(
    <InsightsErrorBoundary>
      <ComponentWithInvalidJSON />
    </InsightsErrorBoundary>,
  )

  expect(screen.getByText(localize(Localization.INSIGHTS_ERROR_TITLE))).toBeInTheDocument()
})

test('calls onError callback when error occurs', () => {
  const onErrorMock = jest.fn()

  render(
    <InsightsErrorBoundary onError={onErrorMock}>
      <ErrorThrowingComponent />
    </InsightsErrorBoundary>,
  )

  expect(onErrorMock).toHaveBeenCalled()
})
