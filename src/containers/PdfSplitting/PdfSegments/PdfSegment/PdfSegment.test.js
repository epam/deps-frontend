
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { setScrollId } from '@/actions/navigation'
import { usePdfSegments } from '@/containers/PdfSplitting/hooks'
import { PdfSegment as SegmentModel, UserPage } from '@/containers/PdfSplitting/models'
import { Localization, localize } from '@/localization/i18n'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { render } from '@/utils/rendererRTL'
import { PdfSegment } from './PdfSegment'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentTypesListPage')

jest.mock('@/actions/navigation', () => ({
  setScrollId: jest.fn(() => mockAction),
}))

jest.mock('uuid', () => ({
  v4: jest.fn(() => mockUUID),
}))

jest.mock('@/containers/PdfSplitting/hooks', () => ({
  usePdfSegments: jest.fn(() => ({
    segments: [mockSegment1],
    selectedGroup: null,
  })),
}))

const mockUUID = 'mocked-uuid'
const mockAction = { type: 'action' }
const mockSegmentId1 = 'segmentId_1'
const mockSegmentId2 = 'segmentId_2'

const mockSegment1 = new SegmentModel({
  id: mockSegmentId1,
  documentTypeId: 'PDF',
  userPages: [
    new UserPage({
      page: 0,
      segmentId: mockSegmentId1,
    }),
  ],
  isSelected: true,
})

const mockSegment2 = new SegmentModel({
  id: mockSegmentId2,
  documentTypeId: 'PDF',
  userPages: [
    new UserPage({
      page: 1,
      segmentId: mockSegmentId2,
    }),
  ],
  isSelected: true,
})

const mockOnDelete = jest.fn()
const mockOnSelect = jest.fn()
const mockOnDocTypeIdChange = jest.fn()
const mockIndex = 0

test('renders PdfSegment component correctly', () => {
  const props = {
    segment: mockSegment1,
    index: mockIndex,
    onSelect: mockOnSelect,
    onDelete: mockOnDelete,
    onDocTypeIdChange: mockOnDocTypeIdChange,
  }

  render(<PdfSegment {...props} />)

  const segmentTitle = screen.getByText(localize(Localization.SEGMENT, { index: mockIndex + 1 }))
  const range = screen.getByText(localize(Localization.PAGES_RANGE, { range: '1' }))
  const select = screen.getByRole('combobox')

  expect(segmentTitle).toBeInTheDocument()
  expect(range).toBeInTheDocument()
  expect(select).toBeInTheDocument()
})

test('calls onDelete callback when click on IconButton', async () => {
  const segments = [
    mockSegment1,
    mockSegment2,
  ]

  const props = {
    segment: mockSegment1,
    index: mockIndex,
    onSelect: mockOnSelect,
    onDelete: mockOnDelete,
    onDocTypeIdChange: mockOnDocTypeIdChange,
  }

  usePdfSegments.mockReturnValueOnce({ segments })

  render(<PdfSegment {...props} />)

  const deleteButton = screen.getByRole('button')
  await userEvent.click(deleteButton)

  expect(mockOnDelete).nthCalledWith(1, mockSegment1.id)
})

test('calls onSelect callback when click on card', async () => {
  const props = {
    segment: mockSegment1,
    index: mockIndex,
    onSelect: mockOnSelect,
    onDelete: mockOnDelete,
    onDocTypeIdChange: mockOnDocTypeIdChange,
  }

  render(<PdfSegment {...props} />)

  const title = screen.getByText(localize(Localization.SEGMENT, { index: 1 }))

  await userEvent.click(title)

  expect(mockOnSelect).nthCalledWith(1, mockSegment1.id)
})

test('calls setScrollId action when click on card if segment is not selected yet', async () => {
  const props = {
    segment: {
      ...mockSegment1,
      isSelected: false,
    },
    index: mockIndex,
    onSelect: mockOnSelect,
    onDelete: mockOnDelete,
    onDocTypeIdChange: mockOnDocTypeIdChange,
  }

  render(<PdfSegment {...props} />)

  const title = screen.getByText(localize(Localization.SEGMENT, { index: 1 }))

  await userEvent.click(title)

  expect(setScrollId).nthCalledWith(1, mockUUID)
})

test('calls onDocTypeIdChange when select document type in select component', async () => {
  const props = {
    segment: mockSegment1,
    index: mockIndex,
    onSelect: mockOnSelect,
    onDelete: mockOnDelete,
    onDocTypeIdChange: mockOnDocTypeIdChange,
  }

  render(<PdfSegment {...props} />)

  const [documentType] = documentTypesSelector.getSelectorMockValue()

  const selectElement = screen.getByRole('combobox')
  await userEvent.click(selectElement)

  const option = screen.getByText(documentType.name)
  await userEvent.click(option, {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  expect(mockOnDocTypeIdChange).nthCalledWith(1, mockSegment1.id, documentType.code)
})
