
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { Extractor, Field } from '../viewModels'
import { LLMExtractorInfo } from './LLMExtractorInfo'

jest.mock('@/utils/env', () => mockEnv)

const mockUseFieldCalibration = jest.fn()
const mockUseExtractorModel = jest.fn()

jest.mock('../hooks', () => ({
  useFieldCalibration: () => mockUseFieldCalibration(),
  useExtractorModel: () => mockUseExtractorModel(),
}))

const mockExtractor = new Extractor({
  id: 'extractor-1',
  name: 'Test Extractor',
  model: 'gpt-4@openai',
  temperature: 0.7,
  topP: 0.9,
  groupingFactor: 5,
  customInstruction: 'Extract all relevant information from the document',
  pageSpan: {
    start: 1,
    end: 10,
  },
})

const mockField = new Field({
  id: 'field-1',
  name: 'Test Field',
  extractorId: 'extractor-1',
})

mockUseFieldCalibration.mockReturnValue({
  activeField: mockField,
  extractors: [mockExtractor],
})

mockUseExtractorModel.mockReturnValue({
  providerName: 'OpenAI',
  modelName: 'GPT-4',
  isFetching: false,
})

test('renders LLM extractor info correctly with all info items provided', async () => {
  render(<LLMExtractorInfo />)

  const btn = screen.getByRole('button')
  await userEvent.click(btn)

  const [
    modelItem,
    temperatureItem,
    groupingFactorItem,
    pageSpanItem,
    topPItem,
    customInstructionsItem,
  ] = screen.getAllByRole('listitem')

  expect(modelItem).toHaveTextContent(localize(Localization.LLM_MODEL))
  expect(modelItem).toHaveTextContent('GPT-4 / OpenAI')

  expect(temperatureItem).toHaveTextContent(localize(Localization.TEMPERATURE))
  expect(temperatureItem).toHaveTextContent(mockExtractor.temperature)

  expect(groupingFactorItem).toHaveTextContent(localize(Localization.GROUPING_FACTOR))
  expect(groupingFactorItem).toHaveTextContent(mockExtractor.groupingFactor)

  expect(pageSpanItem).toHaveTextContent(localize(Localization.PAGE_SPAN))
  expect(pageSpanItem).toHaveTextContent(`${mockExtractor.pageSpan.start} - ${mockExtractor.pageSpan.end}`)

  expect(topPItem).toHaveTextContent(localize(Localization.TOP_P))
  expect(topPItem).toHaveTextContent(mockExtractor.topP)

  expect(customInstructionsItem).toHaveTextContent(localize(Localization.CUSTOM_INSTRUCTION))
  expect(customInstructionsItem).toHaveTextContent(mockExtractor.customInstruction)
})

test('renders button with correct tooltip', () => {
  render(<LLMExtractorInfo />)

  const btn = screen.getByRole('button')

  expect(btn).toBeInTheDocument()
})

test('popover opens and shows all info items', async () => {
  render(<LLMExtractorInfo />)

  const btn = screen.getByRole('button')

  expect(screen.queryByRole('listitem')).not.toBeInTheDocument()

  await userEvent.click(btn)
  const listItems = screen.getAllByRole('listitem')
  expect(listItems.length).toBe(6)

  expect(screen.getByText(localize(Localization.LLM_MODEL))).toBeInTheDocument()
})

test('shows All Pages text for missing pageSpan', async () => {
  const extractorWithoutPageSpan = new Extractor({
    id: 'extractor-no-span',
    name: 'No PageSpan Extractor',
    model: 'gpt-4@openai',
    temperature: 0.7,
    topP: 0.9,
    groupingFactor: 5,
  })

  const fieldForNoPageSpan = new Field({
    id: 'field-2',
    name: 'Test Field 2',
    extractorId: 'extractor-no-span',
  })

  mockUseFieldCalibration.mockReturnValue({
    activeField: fieldForNoPageSpan,
    extractors: [extractorWithoutPageSpan],
  })

  render(<LLMExtractorInfo />)

  const btn = screen.getByRole('button')
  await userEvent.click(btn)

  const pageSpanItem = screen.getAllByRole('listitem')[3]
  expect(pageSpanItem).toHaveTextContent(localize(Localization.ALL_PAGES))
})
