
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import {
  LLMExtractor,
  LLMExtractionParams,
  LLMReference,
} from '@/models/LLMExtractor'
import { render } from '@/utils/rendererRTL'
import { LLMExtractorCell } from './LLMExtractorCell'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/ExtractorLLMType', () => ({
  ExtractorLLMType: ({ llmReference, render }) =>
    render(`${llmReference.provider} | ${llmReference.model}`),
}))

const mockLLMExtractor = new LLMExtractor({
  extractorId: 'id1',
  name: 'LLM Extractor Name 1',
  extractionParams: new LLMExtractionParams({
    customInstruction: 'Test Instructions 1',
    groupingFactor: 1,
    temperature: 0.5,
    topP: 0.3,
  }),
  llmReference: new LLMReference({
    model: 'mockModel 1',
    provider: 'mockProvider 1',
  }),
  queries: [],
})

test('shows correct LLM Extractor for field', () => {
  render(
    <LLMExtractorCell
      llmExtractor={mockLLMExtractor}
    />,
  )

  expect(screen.getByText(mockLLMExtractor.name)).toBeInTheDocument()
  expect(screen.getByText(`${mockLLMExtractor.llmReference.provider} | ${mockLLMExtractor.llmReference.model}`)).toBeInTheDocument()
})
