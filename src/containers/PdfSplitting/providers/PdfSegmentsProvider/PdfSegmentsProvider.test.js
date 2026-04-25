
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext } from 'react'
import { PdfSegment, UserPage } from '@/containers/PdfSplitting/models'
import { render } from '@/utils/rendererRTL'
import { PdfSegmentsProvider, PdfSegmentsContext } from './PdfSegmentsProvider'

jest.mock('@/utils/env', () => mockEnv)

const mockSegment = new PdfSegment({
  id: 'mockId',
  userPages: [],
})

const mockInitialSegment = new PdfSegment({
  id: 'mockInitialId',
  userPages: [],
})

const mockActiveUserPage = new UserPage({
  page: 1,
  segmentId: 'id',
})

const mockUserPages = [
  {
    ...mockActiveUserPage,
    page: 2,
  },
]

const mockAddSegmentBtn = 'Add segment'
const mockAddInitialSegmentBtn = 'Add initial segment'
const mockAddActiveUserPage = 'Add active user page'
const mockIsDraggable = 'Add is draggable'
const mockUpdateActiveUserPageBtn = 'Update active user page'

const MockComponent = () => {
  const {
    segments,
    setSegments,
    initialSegment,
    setInitialSegment,
    activeUserPage,
    setActiveUserPage,
    updateActiveUserPage,
    isDraggable,
    setIsDraggable,
  } = useContext(PdfSegmentsContext)

  return (
    <div>
      <p>
        {segments.length}
      </p>
      <p>
        {initialSegment?.id}
      </p>
      <p>
        {activeUserPage?.page}
      </p>
      <p>
        {isDraggable && mockSegment.id}
      </p>
      <button onClick={() => setSegments([mockSegment])}>
        {mockAddSegmentBtn}
      </button>
      <button onClick={() => setInitialSegment(mockInitialSegment)}>
        {mockAddInitialSegmentBtn}
      </button>
      <button onClick={() => setActiveUserPage(mockActiveUserPage)}>
        {mockAddActiveUserPage}
      </button>
      <button onClick={() => setIsDraggable(true)}>
        {mockIsDraggable}
      </button>
      <button onClick={() => updateActiveUserPage(mockUserPages)}>
        {mockUpdateActiveUserPageBtn}
      </button>
    </div>
  )
}

test('provides context values to children', () => {
  const initialSegmentsLength = 0

  render(
    <PdfSegmentsProvider>
      <MockComponent />
    </PdfSegmentsProvider>,
  )

  const segmentsLength = screen.getByText(initialSegmentsLength)
  const initialSegmentId = screen.queryByText(mockInitialSegment.id)
  const activePage = screen.queryByText(mockActiveUserPage.id)
  const isDraggable = screen.queryByText(mockSegment.id)

  expect(segmentsLength).toBeInTheDocument()
  expect(initialSegmentId).not.toBeInTheDocument()
  expect(activePage).not.toBeInTheDocument()
  expect(isDraggable).not.toBeInTheDocument()
})

test('adds segment when click on add segment button', async () => {
  const expectedSegmentsLength = 1

  render(
    <PdfSegmentsProvider>
      <MockComponent />
    </PdfSegmentsProvider>,
  )

  const addSegmentBtn = screen.getByRole('button', { name: mockAddSegmentBtn })
  await userEvent.click(addSegmentBtn)

  await waitFor(() => {
    const segmentsLength = screen.getByText(expectedSegmentsLength)
    expect(segmentsLength).toBeInTheDocument()
  })
})

test('adds initial segment when click on add initial segment button', async () => {
  render(
    <PdfSegmentsProvider>
      <MockComponent />
    </PdfSegmentsProvider>,
  )

  const initialSegmentId = screen.queryByText(mockInitialSegment.id)
  expect(initialSegmentId).not.toBeInTheDocument()

  const addInitialSegmentBtn = screen.getByRole('button', { name: mockAddInitialSegmentBtn })
  await userEvent.click(addInitialSegmentBtn)

  await waitFor(() => {
    const initialSegmentId = screen.getByText(mockInitialSegment.id)
    expect(initialSegmentId).toBeInTheDocument()
  })
})

test('adds active user page when click on add active page button', async () => {
  render(
    <PdfSegmentsProvider>
      <MockComponent />
    </PdfSegmentsProvider>,
  )

  const activePage = screen.queryByText(mockActiveUserPage.page)
  expect(activePage).not.toBeInTheDocument()

  const addActiveUserPageBtn = screen.getByRole('button', { name: mockAddActiveUserPage })
  await userEvent.click(addActiveUserPageBtn)

  await waitFor(() => {
    const activePage = screen.getByText(mockActiveUserPage.page)
    expect(activePage).toBeInTheDocument()
  })
})

test('sets isDraggable to true when click on set isDraggable button', async () => {
  render(
    <PdfSegmentsProvider>
      <MockComponent />
    </PdfSegmentsProvider>,
  )

  const isDraggable = screen.queryByText(mockSegment.id)
  expect(isDraggable).not.toBeInTheDocument()

  const setIsDraggableBtn = screen.getByRole('button', { name: mockIsDraggable })
  await userEvent.click(setIsDraggableBtn)

  await waitFor(() => {
    const isDraggable = screen.getByText(mockSegment.id)
    expect(isDraggable).toBeInTheDocument()
  })
})

test('renders children correctly', () => {
  const mockTestId = 'test-id'

  render(
    <PdfSegmentsProvider>
      <div data-testid={mockTestId} />
    </PdfSegmentsProvider>,
  )

  expect(screen.getByTestId(mockTestId)).toBeInTheDocument()
})

test('updates active user page when updateActiveUserPage is called', async () => {
  render(
    <PdfSegmentsProvider>
      <MockComponent />
    </PdfSegmentsProvider>,
  )

  const addActiveUserPageBtn = screen.getByRole('button', { name: mockAddActiveUserPage })
  await userEvent.click(addActiveUserPageBtn)

  await waitFor(() => {
    const activePage = screen.getByText(mockActiveUserPage.page)
    expect(activePage).toBeInTheDocument()
  })

  const updateActiveUserPageBtn = screen.getByRole('button', { name: mockUpdateActiveUserPageBtn })
  await userEvent.click(updateActiveUserPageBtn)

  await waitFor(() => {
    const activePage = screen.getByText(mockUserPages[0].page)
    expect(activePage).toBeInTheDocument()
  })
})
