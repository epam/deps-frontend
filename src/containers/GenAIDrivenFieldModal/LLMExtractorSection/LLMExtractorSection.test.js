
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import {
  LLMExtractor,
  LLMExtractionParams,
  LLMReference,
} from '@/models/LLMExtractor'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { render } from '@/utils/rendererRTL'
import { LLMExtractorSection } from './LLMExtractorSection'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentType')

const mockExtractorId = 'id1'

beforeEach(() => {
  jest.clearAllMocks()
  documentTypeStateSelector.mockReturnValue(mockDocumentType)
})

const mockLLMExtractors = [
  new LLMExtractor({
    extractorId: mockExtractorId,
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
  }),
  new LLMExtractor({
    extractorId: 'id2',
    name: 'LLM Extractor Name 2',
    extractionParams: new LLMExtractionParams({
      customInstruction: 'Test Instructions 2',
      groupingFactor: 1,
      temperature: 0.5,
      topP: 0.3,
    }),
    llmReference: new LLMReference({
      model: 'mockModel',
      provider: 'mockProvider',
    }),
    queries: [],
  }),
]

const mockDocumentType = new ExtendedDocumentType({
  code: 'mockCode',
  name: 'Document Type Name',
  llmExtractors: mockLLMExtractors,
})

test('shows correct message if LLM extractor is not set', async () => {
  render(
    <LLMExtractorSection
      onChange={jest.fn()}
      value={undefined}
    />,
  )

  expect(screen.getByText(localize(Localization.LLM_EXTRACTOR))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.LLM_EXTRACTOR_WAS_NOT_ADDED))).toBeInTheDocument()
  expect(screen.getByRole('button', {
    name: localize(Localization.SET_LLM_EXTRACTOR),
  })).toBeInTheDocument()
})

test('shows correct title and specified LLM Extractor', async () => {
  render(
    <LLMExtractorSection
      onChange={jest.fn()}
      value={mockExtractorId}
    />,
  )

  expect(screen.getByText(localize(Localization.LLM_EXTRACTOR))).toBeInTheDocument()
  expect(screen.getByRole('button', {
    name: localize(Localization.CHANGE),
  })).toBeInTheDocument()
  expect(screen.getByText(mockLLMExtractors[0].name)).toBeInTheDocument()
  expect(screen.queryByText(mockLLMExtractors[1].name)).not.toBeInTheDocument()
})
