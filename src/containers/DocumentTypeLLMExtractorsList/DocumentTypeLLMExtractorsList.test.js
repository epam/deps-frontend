
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { ExtractionType } from '@/enums/ExtractionType'
import { Localization, localize } from '@/localization/i18n'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import {
  LLMExtractor,
  LLMExtractionParams,
  LLMReference,
} from '@/models/LLMExtractor'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { render } from '@/utils/rendererRTL'
import { DocumentTypeLLMExtractorsList } from './DocumentTypeLLMExtractorsList'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentType')

jest.mock('@/containers/AddLLMExtractorModalButton', () => ({
  AddLLMExtractorModalButton: () => <button data-testid='add-llm-extractor' />,
}))

jest.mock('./LLMExtractorCard', () => ({
  LLMExtractorCard: ({ llmExtractor }) => <div>{llmExtractor.name}</div>,
}))

const mockLLMExtractors = [
  new LLMExtractor({
    extractorId: 'mockId1',
    name: 'LLM Extractor Name 1',
    llmReference: new LLMReference({
      model: 'modelCode1',
      provider: 'providerCode',
    }),
    queries: [],
    extractionParams: new LLMExtractionParams({
      customInstruction: 'Test Instructions 1',
      groupingFactor: 1,
      temperature: 0.5,
      topP: 0.3,
    }),
  }),
  new LLMExtractor({
    extractorId: 'mockId2',
    name: 'LLM Extractor Name 2',
    llmReference: new LLMReference({
      model: 'modelCode2',
      provider: 'providerCode',
    }),
    queries: [],
    extractionParams: new LLMExtractionParams({
      customInstruction: 'Test Instructions 2',
      groupingFactor: 2,
      temperature: 1,
      topP: 1,
    }),
  }),
]

const mockDocumentType = new ExtendedDocumentType({
  code: 'DocType1',
  name: 'Doc Type 1',
  engine: null,
  extractionType: ExtractionType.AZURE_CLOUD_EXTRACTOR,
  llmExtractors: mockLLMExtractors,
})

beforeEach(() => {
  jest.clearAllMocks()
  documentTypeStateSelector.mockReturnValue(mockDocumentType)
})

test('shows LLM Extractors info panel', async () => {
  render(<DocumentTypeLLMExtractorsList />)

  expect(screen.getByText(localize(Localization.TOTAL_NUMBER))).toHaveTextContent(mockLLMExtractors.length)
  expect(screen.getByTestId('add-llm-extractor')).toBeInTheDocument()
})

test('shows all LLM Extractors cards', async () => {
  render(<DocumentTypeLLMExtractorsList />)

  mockLLMExtractors.forEach((llmExtractor) => {
    expect(screen.getByText(llmExtractor.name)).toBeInTheDocument()
  })
})

test('shows correspondent message if LLM Extractors is empty', async () => {
  documentTypeStateSelector.mockReturnValue({
    ...mockDocumentType,
    llmExtractors: [],
  })

  render(<DocumentTypeLLMExtractorsList />)

  expect(screen.getByText(localize(Localization.LLM_EXTRACTORS_WERE_NOT_FOUND))).toBeInTheDocument()
})
