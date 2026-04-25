
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import {
  LLMExtractor,
  LLMExtractionParams,
  LLMExtractorPageSpan,
  LLMReference,
} from '@/models/LLMExtractor'
import { render } from '@/utils/rendererRTL'
import { LLMExtractorCard } from './LLMExtractorCard'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/ExtractorLLMType', () => ({
  ExtractorLLMType: ({ llmReference, render }) =>
    render(`${llmReference.provider} | ${llmReference.model}`),
}))

jest.mock('@/hooks/useExpandableText', () => ({
  useExpandableText: jest.fn(() => ({
    ExpandableContainer: ({ children }) => (
      <div data-testid={expandableTextTestId}>{children}</div>
    ),
    ToggleExpandIcon: () => <span data-testid={toggleCollapseIconTestId} />,
  })),
}))

jest.mock('../LLMExtractorCommandBar', () => ({
  LLMExtractorCommandBar: () => <div data-testid={commandBarTestId} />,
}))

const mockDocumentTypeId = 'docTypeId'
const expandableTextTestId = 'expandable-text'
const toggleCollapseIconTestId = 'toggle-collapse-icon'
const commandBarTestId = 'command-bar'

const mockLLMExtractor = new LLMExtractor({
  extractorId: 'mockId',
  name: 'LLM Extractor Name 1',
  llmReference: new LLMReference({
    model: 'modelCode',
    provider: 'providerCode',
  }),
  queries: [],
  extractionParams: new LLMExtractionParams({
    customInstruction: 'Test Instructions 1',
    groupingFactor: 1,
    temperature: 0.5,
    topP: 0.3,
    pageSpan: new LLMExtractorPageSpan({
      start: 1,
      end: 2,
    }),
  }),
})

test('renders extractor name', () => {
  render(
    <LLMExtractorCard
      documentTypeId={mockDocumentTypeId}
      llmExtractor={mockLLMExtractor}
      refreshData={jest.fn()}
    />,
  )

  expect(screen.getByText(mockLLMExtractor.name)).toBeInTheDocument()
})

test('renders extraction parameters with labels and values', () => {
  render(
    <LLMExtractorCard
      documentTypeId={mockDocumentTypeId}
      llmExtractor={mockLLMExtractor}
      refreshData={jest.fn()}
    />,
  )

  const {
    pageSpan,
    temperature,
    topP,
    groupingFactor,
  } = mockLLMExtractor.extractionParams

  expect(screen.getByText(localize(Localization.TEMPERATURE))).toHaveTextContent(temperature)
  expect(screen.getByText(localize(Localization.TOP_P))).toHaveTextContent(topP)
  expect(screen.getByText(localize(Localization.GROUPING_FACTOR))).toHaveTextContent(groupingFactor)
  expect(screen.getByText(localize(Localization.PAGE_SPAN))).toHaveTextContent(`${pageSpan.start} — ${pageSpan.end}`)
})

test('renders "All Pages" for PAGE_SPAN when no value is provided', () => {
  const mockLLMExtractorWithoutPagSpan = {
    ...mockLLMExtractor,
    extractionParams: new LLMExtractionParams({
      customInstruction: 'Test Instructions',
      groupingFactor: 0.5,
      temperature: 0.1,
      topP: 0.6,
    }),
  }

  render(
    <LLMExtractorCard
      documentTypeId={mockDocumentTypeId}
      llmExtractor={mockLLMExtractorWithoutPagSpan}
      refreshData={jest.fn()}
    />,
  )

  expect(screen.getByText(localize(Localization.PAGE_SPAN))).toHaveTextContent(localize(Localization.ALL_PAGES))
})

test('renders LLM type with model and provider', () => {
  render(
    <LLMExtractorCard
      documentTypeId={mockDocumentTypeId}
      llmExtractor={mockLLMExtractor}
      refreshData={jest.fn()}
    />,
  )

  expect(screen.getByText(`${mockLLMExtractor.llmReference.provider} | ${mockLLMExtractor.llmReference.model}`)).toBeInTheDocument()
})

test('renders custom instruction text in expandable container', () => {
  render(
    <LLMExtractorCard
      documentTypeId={mockDocumentTypeId}
      llmExtractor={mockLLMExtractor}
      refreshData={jest.fn()}
    />,
  )

  expect(screen.getByTestId(expandableTextTestId)).toBeInTheDocument()
  expect(screen.getByTestId(toggleCollapseIconTestId)).toBeInTheDocument()
  expect(screen.getByText(mockLLMExtractor.extractionParams.customInstruction)).toBeInTheDocument()
})

test('renders command bar', () => {
  render(
    <LLMExtractorCard
      documentTypeId={mockDocumentTypeId}
      llmExtractor={mockLLMExtractor}
      refreshData={jest.fn()}
    />,
  )

  expect(screen.getByTestId(commandBarTestId)).toBeInTheDocument()
})
