
import { mockEnv } from '@/mocks/mockEnv'
import { Extractor } from '@/containers/PromptCalibrationStudio/viewModels'
import { mapExtractorToLLMExtractor } from './mapExtractorToLLMExtractor'

jest.mock('@/utils/env', () => mockEnv)

test('parses model with provider correctly when model includes slash', () => {
  const extractor = new Extractor({
    id: 'extractor-1',
    name: 'Test Extractor',
    model: 'openai@gpt-4',
    temperature: 0.7,
    topP: 0.9,
    groupingFactor: 1,
    customInstruction: 'Test instructions',
    pageSpan: 5,
  })

  const result = mapExtractorToLLMExtractor(extractor)

  expect(result).toEqual({
    extractorName: 'Test Extractor',
    provider: 'openai',
    model: 'gpt-4',
    extractionParams: {
      temperature: 0.7,
      topP: 0.9,
      groupingFactor: 1,
      customInstruction: 'Test instructions',
      pageSpan: 5,
    },
  })
})

test('converts empty string customInstruction to null', () => {
  const extractor = new Extractor({
    id: 'extractor-1',
    name: 'Test Extractor',
    model: 'gpt-4',
    temperature: 0.7,
    topP: 0.9,
    groupingFactor: 1,
    customInstruction: '',
    pageSpan: null,
  })

  const result = mapExtractorToLLMExtractor(extractor)

  expect(result.extractionParams.customInstruction).toBeNull()
})
