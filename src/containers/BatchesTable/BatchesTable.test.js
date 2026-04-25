
import { mockEnv } from '@/mocks/mockEnv'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setFilters, setPagination } from '@/actions/navigation'
import {
  BatchFilterKey,
  PaginationKeys,
  SortDirection,
} from '@/constants/navigation'
import { BATCHES_PER_PAGE } from '@/constants/storage'
import { KnownBusinessEvent } from '@/hooks/useEventSource'
import { Localization, localize } from '@/localization/i18n'
import { Batch, BatchFile } from '@/models/Batch'
import { Pagination } from '@/models/Pagination'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import { render } from '@/utils/rendererRTL'
import { openInNewTarget } from '@/utils/window'
import { BatchesTable } from './BatchesTable'
import { BatchDataKeyColumn } from './columns/BatchDataKeyColumn'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
  useSelector: jest.fn(() => []),
}))

const searchIconTestId = 'search-icon'
jest.mock('@/components/Icons/SearchIcon', () => ({
  SearchIcon: () => <div data-testid={searchIconTestId} />,
}))

jest.mock('@/actions/navigation', () => ({
  setPagination: jest.fn(),
  setSelection: jest.fn(),
  setFilters: jest.fn(),
}))

jest.mock('@/utils/window', () => ({
  openInNewTarget: jest.fn(),
}))

const mockDispatch = jest.fn()

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

jest.mock('@/containers/BatchesTable/BatchesCommandBar', () => ({
  BatchesCommandBar: jest.fn(() => <div data-testid="command-bar" />),
}))

const mockAddEvent = jest.fn()
jest.mock('@/hooks/useEventSource', () => ({
  useEventSource: () => mockAddEvent,
  KnownBusinessEvent: {
    BATCH_STATUS_UPDATED: 'BATCH_STATUS_UPDATED',
  },
}))

jest.mock('@/utils/window', () => ({
  ...jest.requireActual('@/utils/window'),
  openInNewTarget: jest.fn((_event, _url, cb) => {
    mockOpenInNewTargetCallback = cb
    cb()
  }),
}))

let mockOpenInNewTargetCallback

const filterConfig = {
  ...DefaultPaginationConfig,
  ...Pagination.getInitialPagination(BATCHES_PER_PAGE),
}

const mockBatch = new Batch({
  id: '123',
  files: [
    new BatchFile({
      documentTypeId: '2',
      error: null,
      parsingFeatures: ['text', 'tables'],
      name: 'file name',
      llmType: 'llm type',
      engine: 'engine',
      status: 'completed',
    }),
  ],
  group: {
    id: '3',
    name: 'group name',
  },
  name: 'batch name',
  status: 'completed',
  createdAt: '2025-07-01T00:00:00.000Z',
})

const mockBatchData = {
  meta: {
    size: 10,
    total: 100,
  },
  result: [mockBatch],
}

const defaultProps = {
  filterConfig,
  isFetching: false,
  data: mockBatchData,
}

test('renders table with batches correctly', () => {
  render(<BatchesTable {...defaultProps} />)

  const columns = screen.getAllByRole('columnheader')

  const [
    ,
    batchNameColumn,
    batchStatusColumn,
    batchGroupColumn,
    batchCreationDateColumn,
    ,
  ] = columns

  expect(screen.getByText('batch name')).toBeInTheDocument()
  expect(columns).toHaveLength(6)
  expect(batchNameColumn).toHaveTextContent(localize(Localization.NAME))
  expect(batchStatusColumn).toHaveTextContent(localize(Localization.STATUS))
  expect(batchGroupColumn).toHaveTextContent(localize(Localization.GROUP))
  expect(batchCreationDateColumn).toHaveTextContent(localize(Localization.CREATION_DATE))
})

test('calls openInNewTarget with correct args on row click', async () => {
  render(<BatchesTable {...defaultProps} />)

  const [, secondRow] = screen.getAllByRole('row')

  fireEvent.click(secondRow)

  expect(openInNewTarget).nthCalledWith(
    1,
    expect.objectContaining({ target: secondRow }),
    navigationMap.batches.batch(mockBatch.id),
    mockOpenInNewTargetCallback,
  )
})

test('calls dispatch with correct arguments when change page', async () => {
  render(<BatchesTable {...defaultProps} />)

  const lastPage = (
    mockBatchData.meta.total / DefaultPaginationConfig[PaginationKeys.PER_PAGE]
  )

  const pageBtn = screen.getByText(lastPage)

  await userEvent.click(pageBtn)

  expect(mockDispatch).nthCalledWith(
    1,
    setPagination({
      [PaginationKeys.PAGE]: lastPage,
      [PaginationKeys.PER_PAGE]: DefaultPaginationConfig[PaginationKeys.PER_PAGE],
    }),
  )
})

test('calls setFilters with correct arguments on table sort', async () => {
  render(<BatchesTable {...defaultProps} />)

  const sortUpButtons = screen.getAllByLabelText('caret-up')
  const sortFields = [
    BatchDataKeyColumn.NAME,
    BatchDataKeyColumn.STATUS,
    BatchDataKeyColumn.GROUP,
    BatchDataKeyColumn.CREATED_AT,
  ]

  sortUpButtons.forEach((sortButton, i) => {
    jest.clearAllMocks()

    fireEvent.click(sortButton)

    expect(setFilters).nthCalledWith(1,
      expect.objectContaining({
        [BatchFilterKey.SORT_ORDER]: SortDirection.ASC,
        [BatchFilterKey.SORT_BY]: sortFields[i],
        [PaginationKeys.PAGE]: DefaultPaginationConfig[PaginationKeys.PAGE],
        [PaginationKeys.PER_PAGE]: DefaultPaginationConfig[PaginationKeys.PER_PAGE],
      }),
    )
  })
})

test('updates batchesData when data.result changes', () => {
  const { rerender } = render(<BatchesTable {...defaultProps} />)

  const newBatch = new Batch({
    id: '456',
    files: [
      new BatchFile({
        documentTypeId: '2',
        error: null,
        parsingFeatures: ['text', 'tables'],
        name: 'file name',
        llmType: 'llm type',
        engine: 'engine',
        status: 'completed',
      }),
    ],
    group: {
      id: '3',
      name: 'group name',
    },
    name: 'new batch',
    status: 'processing',
    createdAt: '2025-07-02T00:00:00.000Z',
  })

  const newData = {
    ...mockBatchData,
    result: [newBatch],
  }

  rerender(
    <BatchesTable
      {...defaultProps}
      data={newData}
    />,
  )

  expect(screen.getByText('new batch')).toBeInTheDocument()
})

test('should call addEvent from useEventSource with correct arguments when feature SSE is enabled', () => {
  render(<BatchesTable {...defaultProps} />)

  expect(mockAddEvent).toHaveBeenCalledWith(
    KnownBusinessEvent.BATCH_STATUS_UPDATED,
    expect.any(Function),
  )
})

test('should not call addEvent from useEventSource when feature SSE is false', () => {
  jest.clearAllMocks()
  ENV.FEATURE_SERVER_SENT_EVENTS = false
  render(<BatchesTable {...defaultProps} />)

  expect(mockAddEvent).not.toHaveBeenCalled()

  ENV.FEATURE_SERVER_SENT_EVENTS = true
})
