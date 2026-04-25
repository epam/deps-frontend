
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import {
  LLMExtractor,
  LLMExtractionParams,
  LLMReference,
} from '@/models/LLMExtractor'
import { render } from '@/utils/rendererRTL'
import { LLMExtractorCommandBar } from './LLMExtractorCommandBar'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/DeleteDocumentTypeExtractorButton', () => ({
  DeleteDocumentTypeExtractorButton: () => <div data-testid={deleteButtonTestId} />,
}))

jest.mock('@/containers/EditLLMExtractorModalButton', () => ({
  EditLLMExtractorModalButton: () => <div data-testid={editButtonTestId} />,
}))

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
    pageSpan: null,
  }),
})

const mockDocumentTypeId = 'docTypeId'
const editButtonTestId = 'edit-button'
const deleteButtonTestId = 'delete-button'

test('renders command bar correctly', () => {
  render(
    <LLMExtractorCommandBar
      documentTypeId={mockDocumentTypeId}
      llmExtractor={mockLLMExtractor}
      refreshData={jest.fn()}
    />,
  )

  expect(screen.getByTestId(deleteButtonTestId)).toBeInTheDocument()
  expect(screen.getByTestId(editButtonTestId)).toBeInTheDocument()
})
