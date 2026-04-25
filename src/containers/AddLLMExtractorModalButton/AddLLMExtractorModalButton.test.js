
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { ErrorCode } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { LLMExtractorPageSpan } from '@/models/LLMExtractor'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { AddLLMExtractorModalButton } from './AddLLMExtractorModalButton'

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

const mockCreateLLMExtractor = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useCreateLLMExtractorMutation: jest.fn(() => ([
    mockCreateLLMExtractor,
    { isLoading: false },
  ])),
}))

jest.mock('@/containers/LLMExtractorModal', () => ({
  LLMExtractorModal: ({ isVisible, onSave }) => (
    isVisible && (
      <div data-testid='extractor-modal'>
        <button
          data-testid={CREATE_BUTTON_ID}
          onClick={() => onSave(mockData)}
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

const CREATE_BUTTON_ID = 'create-button'
const mockDocumentTypeName = 'Doc Type 1'
const mockProvider = 'Provider'
const mockModel = 'Model'

const mockData = {
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
    <AddLLMExtractorModalButton
      documentTypeName={mockDocumentTypeName}
      onAfterAdding={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  const button = screen.getByTestId('trigger')

  await userEvent.click(button)
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders trigger component and shows modal on trigger click', async () => {
  await renderAndClickOnModalButton()

  expect(screen.getByTestId('extractor-modal')).toBeInTheDocument()
})

test('calls CreateLLMExtractor with correct arguments when Create button is clicked', async () => {
  await renderAndClickOnModalButton()

  const createButton = screen.getByTestId(CREATE_BUTTON_ID)

  await userEvent.click(createButton)

  expect(mockCreateLLMExtractor).nthCalledWith(
    1,
    {
      documentTypeName: mockDocumentTypeName,
      ...mockData,
    },
  )
})

test('shows correct message on successful creation', async () => {
  await renderAndClickOnModalButton()

  const createButton = screen.getByTestId(CREATE_BUTTON_ID)

  await userEvent.click(createButton)

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.LLM_EXTRACTOR_SUCCESS_CREATION),
  )
})

test('calls notifyWarning with correct message when creation fails with a unknown error code', async () => {
  const mockError = new Error('')
  mockCreateLLMExtractor.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  await renderAndClickOnModalButton()

  const createButton = screen.getByTestId(CREATE_BUTTON_ID)

  await userEvent.click(createButton)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})

test('calls notifyWarning with correct message when creation fails with a known error code', async () => {
  const errorCode = ErrorCode.alreadyExistsError
  const mockError = {
    data: {
      code: errorCode,
    },
  }

  mockCreateLLMExtractor.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  await renderAndClickOnModalButton()

  const createButton = screen.getByTestId(CREATE_BUTTON_ID)

  await userEvent.click(createButton)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.ALREADY_EXISTS_ERROR),
  )
})

test('calls onAfterAdding on successful creation', async () => {
  const mockOnAfterAdding = jest.fn()

  render(
    <AddLLMExtractorModalButton
      documentTypeName={mockDocumentTypeName}
      onAfterAdding={mockOnAfterAdding}
      renderTrigger={mockRenderTrigger}
    />,
  )

  const button = screen.getByTestId('trigger')

  await userEvent.click(button)

  const createButton = screen.getByTestId(CREATE_BUTTON_ID)

  await userEvent.click(createButton)

  expect(mockOnAfterAdding).toHaveBeenCalled()
})
