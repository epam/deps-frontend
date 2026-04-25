
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import {
  LLMExtractor,
  LLMExtractionParams,
  LLMExtractorPageSpan,
  LLMReference,
} from '@/models/LLMExtractor'
import { render } from '@/utils/rendererRTL'
import { LLMExtractorsList } from './LLMExtractorsList'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/ExtractorLLMType', () => ({
  ExtractorLLMType: ({ llmReference, render }) =>
    render(`${llmReference.provider} | ${llmReference.model}`),
}))

const mockLLMExtractor1 = new LLMExtractor({
  extractorId: 'id1',
  name: 'LLM Extractor Name 1',
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
  llmReference: new LLMReference({
    model: 'Model 1',
    provider: 'Provider 1',
  }),
  queries: [],
})
const mockLLMExtractor2 = new LLMExtractor({
  extractorId: 'id2',
  name: 'LLM Extractor Name 2',
  extractionParams: new LLMExtractionParams({
    customInstruction: 'Test Instructions 2',
    groupingFactor: 0.5,
    temperature: 0.1,
    topP: 0.6,
    pageSpan: new LLMExtractorPageSpan({
      start: 1,
      end: 2,
    }),
  }),
  llmReference: new LLMReference({
    model: 'Model 2',
    provider: 'Provider 2',
  }),
  queries: [],
})

const mockLLMExtractors = [
  mockLLMExtractor1,
  mockLLMExtractor2,
]

test('shows LLM Extractors List', async () => {
  render(
    <LLMExtractorsList
      llmExtractors={mockLLMExtractors}
      onChange={jest.fn()}
    />,
  )

  mockLLMExtractors.forEach((extractor) => {
    expect(screen.getByText(extractor.name)).toBeInTheDocument()
    expect(screen.getByText(`${extractor.llmReference.provider} | ${extractor.llmReference.model}`)).toBeInTheDocument()
  })
})

test('shows LLM Extractor details if list item is expanded', async () => {
  render(
    <LLMExtractorsList
      llmExtractors={mockLLMExtractors}
      onChange={jest.fn()}
    />,
  )

  const expandedItem = mockLLMExtractors[0]
  const [expandButton] = screen.getAllByLabelText('down')

  await userEvent.click(expandButton)

  const {
    pageSpan,
    temperature,
    topP,
    groupingFactor,
  } = expandedItem.extractionParams

  expect(screen.getByText(localize(Localization.TEMPERATURE))).toHaveTextContent(temperature)
  expect(screen.getByText(localize(Localization.TOP_P))).toHaveTextContent(topP)
  expect(screen.getByText(localize(Localization.GROUPING_FACTOR))).toHaveTextContent(groupingFactor)
  expect(screen.getByText(localize(Localization.PAGE_SPAN))).toHaveTextContent(`${pageSpan.start} — ${pageSpan.end}`)
  expect(screen.getByText(expandedItem.extractionParams.customInstruction)).toBeInTheDocument()
})

test('shows "All Pages" for PAGE_SPAN when no value is provided', async () => {
  const mockLLMExtractors = [
    {
      ...mockLLMExtractor1,
      extractionParams: new LLMExtractionParams({
        customInstruction: 'Test Instructions',
        groupingFactor: 0.5,
        temperature: 0.1,
        topP: 0.6,
      }),
    },
  ]

  render(
    <LLMExtractorsList
      llmExtractors={mockLLMExtractors}
      onChange={jest.fn()}
    />,
  )

  const [expandButton] = screen.getAllByLabelText('down')
  await userEvent.click(expandButton)

  expect(screen.getByText(localize(Localization.PAGE_SPAN))).toHaveTextContent(localize(Localization.ALL_PAGES))
})

test('calls onChange with correct argument on LLM Extractor click', async () => {
  const mockOnChange = jest.fn()

  render(
    <LLMExtractorsList
      llmExtractors={mockLLMExtractors}
      onChange={mockOnChange}
    />,
  )

  const selectedItem = mockLLMExtractors[0]

  await userEvent.click(screen.getByText(selectedItem.name))

  expect(mockOnChange).nthCalledWith(1, selectedItem.extractorId)
})

test('calls onChange with correct argument on LLM Extractor details click', async () => {
  const mockOnChange = jest.fn()

  render(
    <LLMExtractorsList
      llmExtractors={mockLLMExtractors}
      onChange={mockOnChange}
    />,
  )

  const selectedItem = mockLLMExtractors[0]
  const [expandButton] = screen.getAllByLabelText('down')

  await userEvent.click(expandButton)
  await userEvent.click(screen.getByText(selectedItem.extractionParams.customInstruction))

  expect(mockOnChange).nthCalledWith(1, selectedItem.extractorId)
})
