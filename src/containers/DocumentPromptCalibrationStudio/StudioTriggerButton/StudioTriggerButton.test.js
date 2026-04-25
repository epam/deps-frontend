
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { clearActivePolygons, setHighlightedField } from '@/actions/documentReviewPage'
import { DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY } from '@/constants/navigation'
import { DocumentState } from '@/enums/DocumentState'
import { localize, Localization } from '@/localization/i18n'
import { Document } from '@/models/Document'
import { documentSelector } from '@/selectors/documentReviewPage'
import { render } from '@/utils/rendererRTL'
import { StudioTriggerButton } from './StudioTriggerButton'

const mockSetQueryParams = jest.fn()

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/actions/documentReviewPage', () => ({
  clearActivePolygons: jest.fn(() => ({ type: 'mockType' })),
  setHighlightedField: jest.fn(() => ({ type: 'mockType' })),
}))
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/hooks/useQueryParams', () => ({
  useQueryParams: jest.fn(() => ({
    setQueryParams: mockSetQueryParams,
  })),
}))

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()

  defaultProps = {}
})

test('renders button', () => {
  const mockDocument = new Document({
    id: 'mock-document-id',
    state: DocumentState.IN_REVIEW,
  })

  documentSelector.mockReturnValue(mockDocument)

  render(<StudioTriggerButton {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO),
  })

  expect(button).toBeInTheDocument()
})

test('enables button when document is in IN_REVIEW state', () => {
  const mockDocument = new Document({
    id: 'mock-document-id',
    state: DocumentState.IN_REVIEW,
  })

  documentSelector.mockReturnValue(mockDocument)

  render(<StudioTriggerButton {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO),
  })

  expect(button).toBeEnabled()
})

test.each(
  Object.values(DocumentState).filter((state) => state !== DocumentState.IN_REVIEW),
)(
  'disables button when document is in %s state',
  (state) => {
    const mockDocument = new Document({
      id: 'mock-document-id',
      state,
    })

    documentSelector.mockReturnValue(mockDocument)

    render(<StudioTriggerButton {...defaultProps} />)

    const button = screen.getByRole('button', {
      name: localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO),
    })

    expect(button).toBeDisabled()
  },
)

test('calls setQueryParams with correct arguments when button is clicked', async () => {
  const mockDocument = new Document({
    id: 'mock-document-id',
    state: DocumentState.IN_REVIEW,
  })

  documentSelector.mockReturnValue(mockDocument)

  render(<StudioTriggerButton {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO),
  })

  await userEvent.click(button)

  expect(mockSetQueryParams).toHaveBeenNthCalledWith(1, {
    [DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: 1,
  })
})

test('dispatches setHighlightedField and clearActivePolygons when button is clicked', async () => {
  const mockDocument = new Document({
    id: 'mock-document-id',
    state: DocumentState.IN_REVIEW,
  })

  documentSelector.mockReturnValue(mockDocument)

  render(<StudioTriggerButton {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO),
  })

  await userEvent.click(button)

  expect(setHighlightedField).toHaveBeenCalledWith(null)
  expect(clearActivePolygons).toHaveBeenCalled()
})

test('does not call setQueryParams when button is disabled and clicked', async () => {
  const mockDocument = new Document({
    id: 'mock-document-id',
    state: DocumentState.PROCESSING,
  })

  documentSelector.mockReturnValue(mockDocument)

  render(<StudioTriggerButton {...defaultProps} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO),
  })

  await userEvent.click(button)

  expect(mockSetQueryParams).not.toHaveBeenCalled()
})
