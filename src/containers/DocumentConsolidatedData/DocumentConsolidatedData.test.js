
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/dom'
import { usePolling } from 'use-raf-polling'
import { useFetchSupplementsQuery } from '@/apiRTK/documentSupplementsApi'
import { DocumentState } from '@/enums/DocumentState'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentSupplement } from '@/models/DocumentSupplement'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { documentSelector, documentTypeSelector } from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'
import { render } from '@/utils/rendererRTL'
import { DocumentConsolidatedData } from './DocumentConsolidatedData'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/requests')

jest.mock('@/apiRTK/documentSupplementsApi', () => ({
  useFetchSupplementsQuery: jest.fn(() => ({
    data: [mockSupplement],
    isLoading: false,
  })),
}))

jest.mock('@/actions/documentReviewPage', () => ({
  getDocumentExtractedData: jest.fn(),
  getDocumentState: jest.fn(),
  fetchDocumentValidation: jest.fn(),
}))

const mockAddEvent = jest.fn()
jest.mock('@/hooks/useEventSource', () => ({
  useEventSource: jest.fn(() => mockAddEvent),
  KnownBusinessEvent: {
    DOCUMENT_STATE_UPDATED: 'DocumentStateUpdated',
  },
}))
jest.mock('use-raf-polling', () => ({
  usePolling: jest.fn(() => ({
    startPolling: jest.fn(),
    stopPolling: jest.fn(),
  })),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/containers/FieldAdapter', () => ({
  FieldAdapter: ({ disabled }) => (
    <input disabled={disabled} />
  ),
}))

jest.mock('@/containers/EnrichmentField', () => ({
  EnrichmentField: ({ disabled, extraField, supplement }) => (
    <input
      defaultValue={supplement?.name ?? extraField?.name}
      disabled={disabled}
    />
  ),
}))

const addDocumentSupplementTestId = 'add-document-supplement-button'

jest.mock('@/containers/AddDocumentSupplementButton', () => ({
  AddDocumentSupplementButton: ({ disabled }) => (
    <button
      data-testid={addDocumentSupplementTestId}
      disabled={disabled}
    />
  ),
}))

const confidenceDropdownTestId = 'confidence-dropdown'
const fieldTypeDropdownTestId = 'field-type-dropdown'

jest.mock('@/containers/ConfidenceLevelDropdown', () => ({
  ConfidenceLevelDropdown: ({ disabled }) => (
    <button
      data-testid={confidenceDropdownTestId}
      disabled={disabled}
    />
  ),
}))

jest.mock('@/containers/FieldTypeFilterDropdown', () => ({
  FieldTypeFilterDropdown: () => <div data-testid={fieldTypeDropdownTestId} />,
}))

const mockDispatch = jest.fn()

const mockExtraField = new DocumentTypeExtraField({
  code: 'mockExtraFieldCode',
  name: 'mockExtraFieldName',
  order: 0,
})

const mockSupplement = new DocumentSupplement({
  code: 'mockSupplementCode',
  name: 'mockSupplementName',
  type: FieldType.STRING,
  value: 'mockSupplementValue',
})

const defaultDocumentType = documentTypeSelector.getSelectorMockValue()
documentTypeSelector.mockImplementation(() => ({
  ...defaultDocumentType,
  extraFields: [mockExtraField],
  llmExtractors: [],
}))

test('render spinner if data is loading', async () => {
  useFetchSupplementsQuery.mockImplementation(
    jest.fn(() => ({
      data: [mockSupplement],
      isLoading: true,
    })),
  )

  render(<DocumentConsolidatedData />)

  await waitFor(() => {
    expect(screen.getByTestId('spin')).toBeInTheDocument()
  })

  useFetchSupplementsQuery.mockImplementation(
    jest.fn(() => ({
      data: [mockSupplement],
      isLoading: false,
    })),
  )
})

test('render content correctly', async () => {
  render(<DocumentConsolidatedData />)

  expect(screen.getByTestId(confidenceDropdownTestId)).toBeInTheDocument()
  expect(screen.getByTestId(fieldTypeDropdownTestId)).toBeInTheDocument()
  expect(screen.getByDisplayValue(mockSupplement.name)).toBeInTheDocument()
  expect(screen.getByDisplayValue(mockExtraField.name)).toBeInTheDocument()
})

test('render no data if supplement, extra and extraction fields are not provided', async () => {
  useFetchSupplementsQuery.mockImplementation(
    jest.fn(() => ({
      data: [],
      isFetching: false,
    })),
  )

  const defaultDocumentType = documentTypeSelector.getSelectorMockValue()
  documentTypeSelector.mockImplementation(() => ({
    ...defaultDocumentType,
    fields: [],
    extraFields: [],
    llmExtractors: [],
  }))

  render(<DocumentConsolidatedData />)

  await waitFor(() => {
    expect(screen.getByText(localize(Localization.NOTHING_TO_DISPLAY))).toBeInTheDocument()
  })

  useFetchSupplementsQuery.mockImplementation(
    jest.fn(() => ({
      data: [mockSupplement],
      isFetching: false,
    })),
  )

  documentTypeSelector.mockImplementation(() => defaultDocumentType)
})

test('don`t render Confidence Level Dropdown if FEATURE_CONFIGURABLE_CONFIDENCE_LEVEL is disabled', async () => {
  jest.clearAllMocks()

  ENV.FEATURE_CONFIGURABLE_CONFIDENCE_LEVEL = false

  render(<DocumentConsolidatedData />)

  await waitFor(() => {
    expect(screen.queryByTestId(confidenceDropdownTestId)).not.toBeInTheDocument()
  })

  ENV.FEATURE_CONFIGURABLE_CONFIDENCE_LEVEL = true
})

test('should call usePolling for ED with correct arguments', async () => {
  jest.clearAllMocks()

  render(<DocumentConsolidatedData />)

  await waitFor(() => {
    expect(usePolling).nthCalledWith(1, {
      callback: expect.any(Function),
      interval: 2000,
      condition: false,
      onPollingSucceed: expect.any(Function),
    })
  })
})

it('should call usePolling for validation with correct arguments', async () => {
  jest.clearAllMocks()

  render(<DocumentConsolidatedData />)

  await waitFor(() => {
    expect(usePolling).nthCalledWith(2, {
      callback: expect.any(Function),
      interval: 2000,
      condition: false,
      onPollingSucceed: expect.any(Function),
    })
  })
})

test('should call addEvent from useEventSource with correct arguments when SSE is enabled', async () => {
  jest.clearAllMocks()
  ENV.FEATURE_SERVER_SENT_EVENTS = true

  render(<DocumentConsolidatedData />)

  await waitFor(() => {
    expect(mockAddEvent).toHaveBeenCalledWith(
      'DocumentStateUpdated',
      expect.any(Function),
    )
  })
})

test('shows disabled Add Document Supplement button if document is not in review state and has doc type assigned', async () => {
  documentSelector.mockReturnValue({
    ...documentSelector.getSelectorMockValue(),
    state: DocumentState.NEW,
  })

  render(<DocumentConsolidatedData />)

  const button = screen.getByTestId(addDocumentSupplementTestId)

  expect(button).toBeDisabled()
})

test('does not show Add Document Supplement button if feature flag for enrichment is false', () => {
  ENV.FEATURE_ENRICHMENT = false

  render(<DocumentConsolidatedData />)

  expect(screen.queryByTestId(addDocumentSupplementTestId)).not.toBeInTheDocument()

  ENV.FEATURE_ENRICHMENT = true
})

test('shows disabled Confidence Level button if no document type fields', () => {
  documentTypeSelector.mockImplementation(() => ({
    ...defaultDocumentType,
    fields: [],
    extraFields: [],
    llmExtractors: [],
  }))

  render(<DocumentConsolidatedData />)

  expect(screen.getByTestId(confidenceDropdownTestId)).toBeDisabled()
})
