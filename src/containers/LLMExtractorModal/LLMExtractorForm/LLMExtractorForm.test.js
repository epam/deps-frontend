
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/dom'
import { within } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { LLMExtractorForm } from './LLMExtractorForm'

jest.mock('react-hook-form', () => mockReactHookForm)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/ExtractionLLMSelect', () => ({
  ExtractionLLMSelect: () => <div data-testid={LLM_TEST_ID} />,
}))
jest.mock('../InstructionSection', () => ({
  InstructionSection: () => <div data-testid={INSTRUCTION_TEST_ID} />,
}))
jest.mock('../TemperatureSection', () => ({
  TemperatureSection: () => <div data-testid={TEMPERATURE_TEST_ID} />,
}))
jest.mock('@/containers/PageSpanSection', () => ({
  PageSpanSection: () => <div data-testid={PAGE_SPAN_TEST_ID} />,
}))

const INSTRUCTION_TEST_ID = 'instruction-section'
const LLM_TEST_ID = 'llm'
const TEMPERATURE_TEST_ID = 'temperature-section'
const PAGE_SPAN_TEST_ID = 'page-span-section'

test('shows all form sections correctly', () => {
  render(
    <LLMExtractorForm />,
  )

  const nameLabel = screen.getByText(localize(Localization.NAME))
  const nameInput = screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))
  expect(nameLabel).toBeInTheDocument()
  expect(nameInput).toBeInTheDocument()

  const llmLabel = screen.getByText(localize(Localization.LLM_MODEL))
  const llmField = screen.getByTestId(LLM_TEST_ID)
  expect(llmLabel).toBeInTheDocument()
  expect(llmField).toBeInTheDocument()

  const temperatureSection = screen.getByTestId(TEMPERATURE_TEST_ID)
  expect(temperatureSection).toBeInTheDocument()

  const groupingFactorLabel = screen.getByText(localize(Localization.GROUPING_FACTOR))
  const groupingFactorInput = screen.getByPlaceholderText(localize(Localization.GROUPING_FACTOR_PLACEHOLDER))
  expect(groupingFactorLabel).toBeInTheDocument()
  expect(groupingFactorInput).toBeInTheDocument()

  const pageSpanLabel = screen.getByText(localize(Localization.PAGE_SPAN))
  const pageSpanSection = screen.getByTestId(PAGE_SPAN_TEST_ID)
  expect(pageSpanLabel).toBeInTheDocument()
  expect(pageSpanSection).toBeInTheDocument()

  const contextAttachmentsLabel = screen.getByText(localize(Localization.CONTEXT_FOR_EXTRACTION))
  const [contextAttachmentsSelect] = screen.getAllByTestId('CustomSelect')
  const contextAttachmentsSelectedOption = within(contextAttachmentsSelect).getByText(localize(Localization.AI_CONTEXT_TEXT_ONLY))
  expect(contextAttachmentsLabel).toBeInTheDocument()
  expect(contextAttachmentsSelectedOption).toBeInTheDocument()

  const instructionSection = screen.getByTestId(INSTRUCTION_TEST_ID)
  expect(instructionSection).toBeInTheDocument()
})
