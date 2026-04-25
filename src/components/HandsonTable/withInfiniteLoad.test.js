
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withInfiniteLoad } from './withInfiniteLoad'

const scrollVerticallyText = 'Scroll Vertically'
const scrollHorizontallyText = 'Scroll Horizontally'

const mockHotInstance = {
  view: {
    wt: {
      wtTable: {
        getFirstVisibleRow: () => 0,
        getFirstVisibleColumn: () => 0,
      },
    },
  },
  countVisibleRows: () => 10,
  countVisibleCols: () => 10,
  countRows: () => 10,
  countCols: () => 10,
}

const mockScrollHandlerArg = {
  current: {
    hotInstance: mockHotInstance,
  },
}

const MockTable = ({
  afterScrollVertically,
  afterScrollHorizontally,
}) => (
  <div>
    <button
      onClick={() => afterScrollVertically(mockScrollHandlerArg)}
    >
      {scrollVerticallyText}
    </button>
    <button onClick={() => afterScrollHorizontally(mockScrollHandlerArg)}>
      {scrollHorizontallyText}
    </button>
  </div>
)

const mockFetchSize = 40

test('calls fetchMoreData when scrolling vertically', async () => {
  const fetchMoreData = jest.fn()
  const InfiniteLoadTable = withInfiniteLoad(MockTable)

  render(
    <InfiniteLoadTable
      areColumnsLoading={false}
      areRowsLoading={false}
      columnCount={20}
      fetchMoreData={fetchMoreData}
      fetchSize={mockFetchSize}
      rowCount={20}
    />,
  )

  const eventTrigger = screen.getByText(scrollVerticallyText)

  await userEvent.click(eventTrigger)

  expect(fetchMoreData).toHaveBeenCalledWith({ rowSpan: [10, 50] })
})

test('calls fetchMoreData when scrolling horizontally', async () => {
  const fetchMoreData = jest.fn()
  const InfiniteLoadTable = withInfiniteLoad(MockTable)

  render(
    <InfiniteLoadTable
      areColumnsLoading={false}
      areRowsLoading={false}
      columnCount={20}
      fetchMoreData={fetchMoreData}
      fetchSize={mockFetchSize}
      rowCount={20}
    />,
  )

  const eventTrigger = screen.getByText(scrollHorizontallyText)

  await userEvent.click(eventTrigger)

  expect(fetchMoreData).toHaveBeenCalledWith({ colSpan: [10, 50] })
})

test('shows spinner when rows are fetching', () => {
  const fetchMoreData = jest.fn()
  const InfiniteLoadTable = withInfiniteLoad(MockTable)

  render(
    <InfiniteLoadTable
      areColumnsLoading={false}
      areRowsLoading={true}
      columnCount={20}
      fetchMoreData={fetchMoreData}
      fetchSize={mockFetchSize}
      rowCount={20}
    />,
  )

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('shows spinner when columns are fetching', () => {
  const fetchMoreData = jest.fn()
  const InfiniteLoadTable = withInfiniteLoad(MockTable)

  render(
    <InfiniteLoadTable
      areColumnsLoading={true}
      areRowsLoading={false}
      columnCount={20}
      fetchMoreData={fetchMoreData}
      fetchSize={mockFetchSize}
      rowCount={20}
    />,
  )

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})
