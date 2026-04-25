
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { retryLastStep } from '@/actions/documentReviewPage'
import { ALLOW_TO_RETRY_LAST_STEP_STATES } from '@/constants/document'
import { DocumentState, RESOURCE_DOCUMENT_STATE } from '@/enums/DocumentState'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { ErrorMessage } from './ErrorMessage'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/RetryPreviousStepButton', () => ({
  RetryPreviousStepButton: ({ retryLastStep }) => (
    <button
      data-testid={RETRY_BUTTON_ID}
      onClick={retryLastStep}
    />
  ),
}))

const RETRY_BUTTON_ID = 'retry-last-step-button'

jest.mock('@/actions/documentReviewPage', () => ({
  retryLastStep: jest.fn(),
}))

const mockDocumentId = 'DocId'
const mockError = {
  description: 'Error Description',
  inState: DocumentState.PREPROCESSING,
}

test('renders Error message and Retry button correctly', () => {
  render(
    <ErrorMessage
      documentId={mockDocumentId}
      error={mockError}
      state={DocumentState.FAILED}
    />,
  )

  expect(screen.getByText(localize(Localization.ERROR_IN_STATE, { state: RESOURCE_DOCUMENT_STATE[mockError.inState] }))).toBeInTheDocument()
  expect(screen.getByText(mockError.description)).toBeInTheDocument()
  expect(screen.getByTestId(RETRY_BUTTON_ID)).toBeInTheDocument()
})

test('does not render Retry button if Retry last step action is not allowed for current document state', () => {
  const forbiddenToRetryLastStepStates = Object.values(DocumentState).filter((state) => !ALLOW_TO_RETRY_LAST_STEP_STATES.includes(state))

  forbiddenToRetryLastStepStates.forEach((state) => {
    render(
      <ErrorMessage
        documentId={mockDocumentId}
        error={mockError}
        state={state}
      />,
    )

    expect(screen.queryByTestId(RETRY_BUTTON_ID)).not.toBeInTheDocument()
  })
})

test('does not render Retry button if ENV.FEATURE_RETRY_PREVIOUS_STEP is off', () => {
  ENV.FEATURE_RETRY_PREVIOUS_STEP = false

  render(
    <ErrorMessage
      documentId={mockDocumentId}
      error={mockError}
      state={DocumentState.FAILED}
    />,
  )

  expect(screen.queryByTestId(RETRY_BUTTON_ID)).not.toBeInTheDocument()

  ENV.FEATURE_RETRY_PREVIOUS_STEP = true
})

test('calls retryLastStep with correct arguments when Retry button is clicked', async () => {
  render(
    <ErrorMessage
      documentId={mockDocumentId}
      error={mockError}
      state={DocumentState.FAILED}
    />,
  )

  const button = screen.getByTestId(RETRY_BUTTON_ID)
  await userEvent.click(button)

  expect(retryLastStep).nthCalledWith(1, mockDocumentId)
})

test('shows correct message on successful Retry last step', async () => {
  render(
    <ErrorMessage
      documentId={mockDocumentId}
      error={mockError}
      state={DocumentState.FAILED}
    />,
  )

  const button = screen.getByTestId(RETRY_BUTTON_ID)
  await userEvent.click(button)

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.RETRY_LAST_STEP_SUCCESS, { stepNumber: RESOURCE_DOCUMENT_STATE[mockError.inState] }),
  )
})

test('shows correct warning message on Retry last step fails', async () => {
  const mockResponseError = new Error('')
  retryLastStep.mockImplementationOnce(() => Promise.reject(mockResponseError))

  render(
    <ErrorMessage
      documentId={mockDocumentId}
      error={mockError}
      state={DocumentState.FAILED}
    />,
  )

  const button = screen.getByTestId(RETRY_BUTTON_ID)
  await userEvent.click(button)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})
