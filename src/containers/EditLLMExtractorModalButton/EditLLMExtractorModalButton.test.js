
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { ErrorCode } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import {
  LLMExtractorPageSpan,
  LLMExtractor,
  LLMReference,
  LLMExtractionParams,
} from '@/models/LLMExtractor'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { EditLLMExtractorModalButton } from './EditLLMExtractorModalButton'

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

const mockUpdateLLMExtractor = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

const mockUpdateExtractorLLMReference = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useUpdateLLMExtractorMutation: jest.fn(() => ([
    mockUpdateLLMExtractor,
    { isLoading: false },
  ])),
  useUpdateExtractorLLMReferenceMutation: jest.fn(() => ([
    mockUpdateExtractorLLMReference,
    { isLoading: false },
  ])),
}))

jest.mock('@/containers/LLMExtractorModal', () => ({
  LLMExtractorModal: ({ isVisible, onSave }) => (
    isVisible && (
      <div data-testid='extractor-modal'>
        <button
          data-testid={SUBMIT_BUTTON_ID}
          onClick={() => onSave(mockFormData)}
        />
      </div>
    )
  ),
}))

const mockRenderTrigger = (onClick) => (
  <button
    data-testid={'trigger'}
    onClick={onClick}
  />
)

const SUBMIT_BUTTON_ID = 'submit-button'
const mockDocumentTypeId = 'docTypeId'
const mockProvider = 'Provider'
const mockModel = 'Model'

const mockLLMExtractor = new LLMExtractor({
  extractorId: 'mockId1',
  name: 'LLM Extractor Name 1',
  llmReference: new LLMReference({
    model: 'modelCode1',
    provider: 'providerCode',
  }),
  queries: [],
  extractionParams: new LLMExtractionParams({
    customInstruction: 'Test Instructions 1',
    groupingFactor: 2,
    pageSpan: null,
    temperature: 0.5,
    topP: 0.3,
  }),
})

const mockFormData = {
  extractorName: 'Test Name',
  provider: mockProvider,
  model: mockModel,
  extractionParams: {
    customInstruction: 'Test Instruction',
    groupingFactor: 1,
    temperature: 0,
    topP: 1,
    pageSpan: new LLMExtractorPageSpan({
      start: 1,
      end: 2,
    }),
  },
}

const renderAndClickOnModalButton = async () => {
  render(
    <EditLLMExtractorModalButton
      documentTypeId={mockDocumentTypeId}
      llmExtractor={mockLLMExtractor}
      onAfterEditing={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  const button = screen.getByTestId('trigger')

  await userEvent.click(button)
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders modal correctly on trigger button click', async () => {
  await renderAndClickOnModalButton()

  expect(screen.getByTestId('extractor-modal')).toBeInTheDocument()
})

test('calls updateLLMExtractor with correct arguments when Submit button is clicked', async () => {
  await renderAndClickOnModalButton()

  const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID)

  await userEvent.click(submitButton)

  expect(mockUpdateLLMExtractor).nthCalledWith(
    1,
    {
      documentTypeId: mockDocumentTypeId,
      extractorId: mockLLMExtractor.extractorId,
      data: {
        name: mockFormData.extractorName,
        extractionParams: mockFormData.extractionParams,
      },
    },
  )
})

test('calls updateExtractorLLMReference with correct arguments when Submit button is clicked', async () => {
  await renderAndClickOnModalButton()

  const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID)

  await userEvent.click(submitButton)

  expect(mockUpdateExtractorLLMReference).nthCalledWith(
    1,
    {
      documentTypeId: mockDocumentTypeId,
      extractorId: mockLLMExtractor.extractorId,
      data: {
        model: mockFormData.model,
        provider: mockFormData.provider,
      },
    },
  )
})

test('shows correct message on successful updating', async () => {
  await renderAndClickOnModalButton()

  const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID)

  await userEvent.click(submitButton)

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.LLM_EXTRACTOR_SUCCESS_UPDATING),
  )
})

test('calls notifyWarning with correct message when update fails with a unknown error code', async () => {
  const mockError = new Error('')
  mockUpdateLLMExtractor.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  await renderAndClickOnModalButton()

  const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID)

  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})

test('calls notifyWarning with correct message when update fails with a known error code', async () => {
  const errorCode = ErrorCode.invariantViolationError
  const mockError = {
    data: {
      code: errorCode,
    },
  }

  mockUpdateLLMExtractor.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  await renderAndClickOnModalButton()

  const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID)

  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.INVARIANT_VIOLATION_ERROR),
  )
})

test('calls onAfterEditing on successful updating', async () => {
  const mockOnAfterEditing = jest.fn()

  render(
    <EditLLMExtractorModalButton
      documentTypeId={mockDocumentTypeId}
      llmExtractor={mockLLMExtractor}
      onAfterEditing={mockOnAfterEditing}
      renderTrigger={mockRenderTrigger}
    />,
  )

  const button = screen.getByRole('button')
  await userEvent.click(button)

  const submitButton = screen.getByTestId(SUBMIT_BUTTON_ID)
  await userEvent.click(submitButton)

  expect(mockOnAfterEditing).toHaveBeenCalled()
})
