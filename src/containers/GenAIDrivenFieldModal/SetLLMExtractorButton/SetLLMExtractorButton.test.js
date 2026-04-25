
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchDocumentType } from '@/actions/documentType'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { Localization, localize } from '@/localization/i18n'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import { render } from '@/utils/rendererRTL'
import { SetLLMExtractorButton } from './SetLLMExtractorButton'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/actions/documentType', () => ({
  fetchDocumentType: jest.fn(() => ({ type: 'mockType' })),
}))

jest.mock('@/containers/AddLLMExtractorModalButton', () => ({
  AddLLMExtractorModalButton: ({ renderTrigger, onAfterAdding }) => {
    refreshData = onAfterAdding
    return renderTrigger()
  },
}))

jest.mock('../LLMExtractorsList', () => ({
  LLMExtractorsList: () => <div data-testid={'llm-extractors-list'} />,
}))

const mockRenderTrigger = (onClick) => (
  <button
    data-testid={'trigger'}
    onClick={onClick}
  />
)

const mockRef = {
  current: document.body.appendChild(
    document.createElement('div'),
  ),
}

const mockDocumentType = new ExtendedDocumentType({
  code: 'doc-type',
  name: 'Document Type',
})

let refreshData = jest.fn()

test('renders trigger component', async () => {
  render(
    <SetLLMExtractorButton
      containerRef={mockRef}
      documentType={mockDocumentType}
      onChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  expect(screen.getByTestId('trigger')).toBeInTheDocument()
})

test('refetches document type after adding llm extractor ', async () => {
  render(
    <SetLLMExtractorButton
      containerRef={mockRef}
      documentType={mockDocumentType}
      onChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await userEvent.click(screen.getByTestId('trigger'))

  refreshData()

  expect(fetchDocumentType).nthCalledWith(
    1,
    mockDocumentType.code,
    [DocumentTypeExtras.LLM_EXTRACTORS],
  )
})

test('shows modal with correct layout on trigger click', async () => {
  render(
    <SetLLMExtractorButton
      containerRef={mockRef}
      documentType={mockDocumentType}
      onChange={jest.fn()}
      renderTrigger={mockRenderTrigger}
    />,
  )

  await userEvent.click(screen.getByTestId('trigger'))

  expect(screen.getByRole('dialog')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.LLM_EXTRACTORS_LIST))).toBeInTheDocument()
  expect(screen.getByRole('button', {
    name: localize(Localization.CREATE_LLM_EXTRACTOR),
  })).toBeInTheDocument()
  expect(screen.getByTestId('llm-extractors-list')).toBeInTheDocument()
})
