
import { mockEnv } from '@/mocks/mockEnv'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setScrollId } from '@/actions/navigation'
import { documentTypeSelector } from '@/selectors/documentReviewPage'
import { render } from '@/utils/rendererRTL'
import { FieldValidationMessage } from './FieldValidationMessage'

const mockAction = { type: 'action' }

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/actions/navigation', () => ({
  setScrollId: jest.fn(() => mockAction),
}))

jest.mock('@/components/LongText', () => ({
  LongText: ({ text }) => <span data-testid={longTextTestId}>{text}</span>,
}))

const longTextTestId = 'long-text'

const documentType = documentTypeSelector.getSelectorMockValue()
const [dependentField] = documentType.fields

const mockValidationError = {
  column: null,
  message: 'test error',
  index: null,
  row: null,
}

const crossFieldSubMessage = 'field depends on'
const mockCrossFieldError = {
  column: null,
  message: crossFieldSubMessage + '${' + dependentField.code + '}',
  index: null,
  row: null,
}

test('renders validation message correctly', () => {
  render(
    <FieldValidationMessage
      validationItem={mockValidationError}
    />,
  )

  expect(screen.getByText(mockValidationError.message)).toBeInTheDocument()
  expect(screen.getByTestId(longTextTestId)).toBeInTheDocument()
})

test('renders validation message correctly in case disableTruncate is true', () => {
  render(
    <FieldValidationMessage
      disableTruncate
      validationItem={mockValidationError}
    />,
  )

  expect(screen.getByText(mockValidationError.message)).toBeInTheDocument()
  expect(screen.queryByTestId(longTextTestId)).not.toBeInTheDocument()
})

test('renders cross field validation message correctly', () => {
  render(
    <FieldValidationMessage
      validationItem={mockCrossFieldError}
    />,
  )

  const subMessage = screen.getByText('field depends on')

  expect(subMessage).toBeInTheDocument()
  expect(within(subMessage).getByText(dependentField.name)).toBeInTheDocument()
})

test('calls onClick handler when user clicks on dependent field link', async () => {
  render(
    <FieldValidationMessage
      validationItem={mockCrossFieldError}
    />,
  )

  await userEvent.click(screen.getByText(dependentField.name))

  expect(setScrollId).toHaveBeenCalled()
})
