
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/dom'
import { Localization, localize } from '@/localization/i18n'
import {
  LLMExtractor,
  LLMExtractionParams,
  LLMReference,
} from '@/models/LLMExtractor'
import { render } from '@/utils/rendererRTL'
import { GenAIDrivenFieldForm } from './GenAIDrivenFieldForm'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => mockReactHookForm)

jest.mock('@/containers/ManageDisplayModeFormSection', () => ({
  ManageDisplayModeFormSection: () => <div data-testid='manage-display-mode-section' />,
}))
jest.mock('../LLMExtractorSection', () => ({
  LLMExtractorSection: () => <div data-testid='extractor-section' />,
}))
jest.mock('../FieldTypeSection', () => ({
  FieldTypeSection: () => <div data-testid='field-type-section' />,
}))
jest.mock('../PromptChainingSection', () => ({
  PromptChainingSection: () => <div data-testid='prompt-chaining-section' />,
}))

const mockLLMExtractor = new LLMExtractor({
  extractorId: 'id',
  name: 'LLM Extractor Name 1',
  extractionParams: new LLMExtractionParams({
    customInstruction: 'Test Instructions 1',
    groupingFactor: 1,
    temperature: 0.5,
    topP: 0.3,
  }),
  llmReference: new LLMReference({
    model: 'mockModel',
    provider: 'mockProvider',
  }),
  queries: [],
})

test('render GenAIDrivenFieldForm layout correctly', () => {
  const props = {
    isEditing: false,
    handleSubmit: jest.fn(),
    saveField: jest.fn(),
    llmExtractors: [mockLLMExtractor],
  }

  render(
    <GenAIDrivenFieldForm {...props} />,
  )

  const expectedLabels = [
    localize(Localization.NAME),
    localize(Localization.REQUIRED_FIELD),
  ]

  expectedLabels.forEach((label) => {
    expect(screen.getByText(label)).toBeInTheDocument()
  })
  expect(screen.getByTestId('extractor-section')).toBeInTheDocument()
  expect(screen.getByTestId('field-type-section')).toBeInTheDocument()
  expect(screen.getByTestId('manage-display-mode-section')).toBeInTheDocument()
  expect(screen.getByTestId('prompt-chaining-section')).toBeInTheDocument()
})
