
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import flushPromises from 'flush-promises'
import { PipelineStepModal } from '@/containers/PipelineStepModal'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { DocumentState } from '@/enums/DocumentState'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { PipelineStep } from '@/enums/PipelineStep'
import { Localization, localize } from '@/localization/i18n'
import { Document } from '@/models/Document'
import { render } from '@/utils/rendererRTL'
import { ParsingTypeOption } from './ParsingTypeOption'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => mockReactRedux)

jest.mock('../hooks', () => ({
  useLayoutEditAction: jest.fn(() => ({
    handleEditAction: mockHandleEditAction,
  })),
}))

jest.mock('@/selectors/documentReviewPage')

jest.mock('@/containers/ParsingLayout/EntityLayout/hooks', () => ({
  useLayoutData: jest.fn(() => mockUseLayoutData()),
}))

jest.mock('@/containers/PipelineStepModal', () => ({
  PipelineStepModal: jest.fn(({ renderTrigger }) => {
    const mockOpen = jest.fn()
    return renderTrigger(mockOpen)
  }),
}))

const createMockParsingInfoData = (overrides = {}) => ({
  documentLayoutInfo: {
    parsingFeatures: {
      TESSERACT: [KnownParsingFeature.TEXT],
      GCP_VISION: [KnownParsingFeature.TEXT, KnownParsingFeature.TABLES],
    },
  },
  ...overrides,
})

const createMockOption = (overrides = {}) => ({
  value: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
  text: 'Tesseract',
  ...overrides,
})

const createMockDocument = (overrides = {}) => new Document({
  id: 'mock-document-id',
  state: DocumentState.IN_REVIEW,
  engine: 'mock-engine',
  llmType: 'mock-llm-type',
  error: null,
  files: [{ blobName: 'document.pdf' }],
  ...overrides,
})

const mockUseLayoutData = jest.fn(() => ({
  layoutId: 'mock-document-id',
  layoutType: 'document',
  isFile: false,
  file: null,
  document: createMockDocument(),
}))

const mockHandleEditAction = jest.fn().mockResolvedValue(true)

beforeEach(() => {
  jest.clearAllMocks()

  mockEnv.ENV.FEATURE_DOCUMENT_LAYOUT_EDITING = true
})

test('renders option text correctly', () => {
  const option = createMockOption()
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.getByText('Tesseract')).toBeInTheDocument()
})

test('shows copy for editing link when option is already processed and document is in review state', () => {
  const option = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.getByRole('button', { name: localize(Localization.COPY_FOR_EDITING) })).toBeInTheDocument()
})

test('shows copy for editing link when option is already processed and document is in completed state', () => {
  const option = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument({ state: DocumentState.COMPLETED }),
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.getByRole('button', { name: localize(Localization.COPY_FOR_EDITING) })).toBeInTheDocument()
})

test('does not show copy for editing link when document is not in allowed states', () => {
  const option = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument({ state: DocumentState.PARSING }),
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.COPY_FOR_EDITING))).not.toBeInTheDocument()
})

test('does not show copy for editing link when option is not already processed', () => {
  const option = createMockOption({ value: 'UNPROCESSED_ENGINE' })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.COPY_FOR_EDITING))).not.toBeInTheDocument()
})

test('does not show copy for editing link when option is user defined', () => {
  const option = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.COPY_FOR_EDITING))).not.toBeInTheDocument()
})

test('does not show copy for editing link when feature flag is disabled', () => {
  const option = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  mockEnv.ENV.FEATURE_DOCUMENT_LAYOUT_EDITING = false

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.COPY_FOR_EDITING))).not.toBeInTheDocument()
  mockEnv.ENV.FEATURE_DOCUMENT_LAYOUT_EDITING = true
})

test('calls handleEditAction and setSelectedParsingType when copy for editing is clicked', async () => {
  jest.clearAllMocks()

  const option = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument(),
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  const copyButton = screen.getByRole('button', { name: localize(Localization.COPY_FOR_EDITING) })
  await userEvent.click(copyButton)

  expect(mockHandleEditAction).toHaveBeenCalledWith(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT)

  await flushPromises()

  expect(setSelectedParsingType).toHaveBeenCalledWith(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED)
})

test('does not call setSelectedParsingType when handleEditAction returns false', async () => {
  jest.clearAllMocks()

  const option = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  mockHandleEditAction.mockResolvedValueOnce(false)

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument(),
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  const copyButton = screen.getByRole('button', { name: localize(Localization.COPY_FOR_EDITING) })
  await userEvent.click(copyButton)

  expect(mockHandleEditAction).toHaveBeenCalledWith(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT)

  await flushPromises()

  expect(setSelectedParsingType).not.toHaveBeenCalled()
})

test('shows start parsing link when option is not already processed and not user defined', () => {
  const option = createMockOption({ value: 'UNPROCESSED_ENGINE' })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument(),
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.getByRole('button', { name: localize(Localization.START_PARSING) })).toBeInTheDocument()
})

test('does not show start parsing link when option is already processed', () => {
  const option = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.START_PARSING))).not.toBeInTheDocument()
})

test('does not show start parsing link when option is user defined', () => {
  const option = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.START_PARSING))).not.toBeInTheDocument()
})

test('calls closeDropdown when start parsing is clicked', async () => {
  const option = createMockOption({ value: 'UNPROCESSED_ENGINE' })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument(),
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  const startParsingButton = screen.getByRole('button', { name: localize(Localization.START_PARSING) })
  await userEvent.click(startParsingButton)

  expect(closeDropdown).toHaveBeenCalled()
})

test('handles case when parsingInfoData is undefined', () => {
  const option = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument(),
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={undefined}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.COPY_FOR_EDITING))).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: localize(Localization.START_PARSING) })).toBeInTheDocument()
})

test('handles case when parsingInfoData.documentLayoutInfo is null', () => {
  const option = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = {
    documentLayoutInfo: null,
  }

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument(),
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.COPY_FOR_EDITING))).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: localize(Localization.START_PARSING) })).toBeInTheDocument()
})

test('shows copy for editing for processed option and start parsing for unprocessed option', () => {
  const processedOption = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT })
  const unprocessedOption = createMockOption({ value: 'UNPROCESSED_ENGINE' })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument(),
  })

  const { rerender } = render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={processedOption}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.getByText(localize(Localization.COPY_FOR_EDITING))).toBeInTheDocument()
  expect(screen.queryByText(localize(Localization.START_PARSING))).not.toBeInTheDocument()

  rerender(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={unprocessedOption}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.COPY_FOR_EDITING))).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: localize(Localization.START_PARSING) })).toBeInTheDocument()
})

test('shows start parsing when option is selected and parsing is available', () => {
  const selectedOption = createMockOption({ value: 'SELECTED_ENGINE' })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData({
    documentLayoutInfo: {
      parsingFeatures: {
        TESSERACT: [KnownParsingFeature.TEXT],
      },
    },
  })

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument(),
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={selectedOption}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.getByRole('button', { name: localize(Localization.START_PARSING) })).toBeInTheDocument()
  expect(screen.queryByText(localize(Localization.COPY_FOR_EDITING))).not.toBeInTheDocument()
})

test('does not show start parsing when selected option is user defined', () => {
  const selectedUserDefinedOption = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={selectedUserDefinedOption}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.START_PARSING))).not.toBeInTheDocument()
  expect(screen.queryByText(localize(Localization.COPY_FOR_EDITING))).not.toBeInTheDocument()
})

test('does not show start parsing when selected option is already processed', () => {
  const selectedProcessedOption = createMockOption({ value: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument(),
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={selectedProcessedOption}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.START_PARSING))).not.toBeInTheDocument()
  expect(screen.getByText(localize(Localization.COPY_FOR_EDITING))).toBeInTheDocument()
})

test('does not show start parsing when document is not in available states', () => {
  const selectedOption = createMockOption({ value: 'SELECTED_ENGINE' })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument({ state: DocumentState.PARSING }),
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={selectedOption}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.START_PARSING))).not.toBeInTheDocument()
  expect(screen.queryByText(localize(Localization.COPY_FOR_EDITING))).not.toBeInTheDocument()
})

test('passes correct props to PipelineStepModal for start parsing', () => {
  const option = createMockOption({ value: 'UNPROCESSED_ENGINE' })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: createMockDocument(),
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(PipelineStepModal).toHaveBeenCalledWith(
    expect.objectContaining({
      documentId: 'mock-document-id',
      documentLLMType: 'mock-llm-type',
      documentState: DocumentState.IN_REVIEW,
      error: null,
      modalTitle: expect.any(String),
      selectedEngine: 'UNPROCESSED_ENGINE',
      step: PipelineStep.PARSING,
    }),
    {},
  )
})

test('does not show start parsing when document is DOCX file', () => {
  const option = createMockOption({ value: 'UNPROCESSED_ENGINE' })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  const docxDocument = createMockDocument({
    files: [{ blobName: 'document.docx' }],
  })

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: docxDocument,
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.queryByText(localize(Localization.START_PARSING))).not.toBeInTheDocument()
})

test('shows start parsing when document is not DOCX file', () => {
  const option = createMockOption({ value: 'UNPROCESSED_ENGINE' })
  const closeDropdown = jest.fn()
  const setSelectedParsingType = jest.fn()
  const rawParsingInfoData = createMockParsingInfoData()

  const pdfDocument = createMockDocument({
    files: [{ blobName: 'document.pdf' }],
  })

  mockUseLayoutData.mockReturnValueOnce({
    layoutId: 'mock-document-id',
    layoutType: 'document',
    isFile: false,
    file: null,
    document: pdfDocument,
  })

  render(
    <ParsingTypeOption
      closeDropdown={closeDropdown}
      option={option}
      rawParsingInfoData={rawParsingInfoData}
      setSelectedParsingType={setSelectedParsingType}
    />,
  )

  expect(screen.getByRole('button', { name: localize(Localization.START_PARSING) })).toBeInTheDocument()
})
