
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usePdfSegments } from '@/containers/PdfSplitting/hooks'
import { PdfSegment, UserPage } from '@/containers/PdfSplitting/models'
import { render } from '@/utils/rendererRTL'
import { SegmentsSeparator } from './SegmentsSeparator'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./SegmentsSeparator.styles', () => ({
  StyledScissorsIcon: () => <div data-testid={mockScissorsIconId} />,
  StyledLockIcon: () => <div data-testid={mockLockIconId} />,
  Separator: () => <div data-testid={mockSeparatorId} />,
  SeparatorContainer: ({ onClick, children }) => (
    <button
      data-testid={mockContainerId}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}))

jest.mock('@/containers/PdfSplitting/models', () => ({
  ...jest.requireActual('@/containers/PdfSplitting/models'),
  PdfSegment: {
    split: jest.fn((segment) => segment),
    merge: jest.fn((segment) => segment),
  },
}))

jest.mock('@/containers/PdfSplitting/hooks', () => ({
  usePdfSegments: jest.fn(() => ({
    segments: mockSegments,
    setSegments: mockSetSegments,
    initialSegment: mockSegments[0],
    activeUserPage: null,
    updateActiveUserPage: mockUpdateActiveUserPage,
  })),
}))

const mockSegments = [
  {
    id: 'test',
    userPages: [new UserPage({
      page: 0,
      segmentId: 'test',
    })],
  },
  {
    id: 'test2',
    userPages: [
      new UserPage({
        page: 1,
        segmentId: 'test2',
      }),
      new UserPage({
        page: 2,
        segmentId: 'test2',
      }),
    ],
  },
  {
    id: 'test3',
    userPages: [new UserPage({
      page: 3,
      segmentId: 'test3',
    })],
  },
]

const mockSetSegments = jest.fn()
const mockUpdateActiveUserPage = jest.fn()
const mockSeparatorId = 'separator'
const mockContainerId = 'separator-container'
const mockScissorsIconId = 'scissors-icon'
const mockLockIconId = 'lock-icon'

test('renders SegmentsSeparator correctly', () => {
  const props = {
    userPage: mockSegments[1].userPages[0],
  }

  render(<SegmentsSeparator {...props} />)

  const separator = screen.getByTestId(mockSeparatorId)
  const scissorsIcon = screen.getByTestId(mockScissorsIconId)
  const separatorContainer = screen.getByTestId(mockContainerId)

  expect(separator).toBeInTheDocument()
  expect(scissorsIcon).toBeInTheDocument()
  expect(separatorContainer).toBeInTheDocument()
})

test('calls Segment.merge with setSegments when click on disabled separator', async () => {
  jest.clearAllMocks()

  const props = {
    userPage: mockSegments[1].userPages[0],
  }

  render(<SegmentsSeparator {...props} />)

  const separatorContainer = screen.getByTestId('separator-container')
  await userEvent.click(separatorContainer)

  expect(mockSetSegments).nthCalledWith(1, [
    mockSegments[0],
    mockSegments[2],
  ])
  expect(PdfSegment.merge).toHaveBeenCalledTimes(1)
})

test('calls Segment.split with setSegments when click on active separator', async () => {
  jest.clearAllMocks()

  const props = {
    userPage: mockSegments[1].userPages[1],
  }

  render(<SegmentsSeparator {...props} />)

  const separatorContainer = screen.getByTestId('separator-container')
  await userEvent.click(separatorContainer)

  expect(mockSetSegments).nthCalledWith(1, mockSegments)
  expect(PdfSegment.split).toHaveBeenCalledTimes(1)
})

test('renders LockIcon when separator is disabled', () => {
  jest.clearAllMocks()

  const mockUserPage = new UserPage({
    page: 0,
    segmentId: 'test',
    isExcluded: true,
  })

  usePdfSegments.mockReturnValueOnce({
    segments: [
      {
        ...mockSegments[0],
        userPages: [
          ...mockSegments[0].userPages,
          mockUserPage,
        ],
      },
    ],
    setSegments: mockSetSegments,
    activeUserPage: null,
    updateActiveUserPage: mockUpdateActiveUserPage,
  })

  const props = {
    userPage: mockUserPage,
  }

  render(<SegmentsSeparator {...props} />)

  const lockIcon = screen.getByTestId(mockLockIconId)

  expect(lockIcon).toBeInTheDocument()
})

test('calls updateActiveUserPage when splitting segments with active user page', async () => {
  jest.clearAllMocks()

  const mockActiveUserPage = mockSegments[1].userPages[1]

  usePdfSegments.mockReturnValueOnce({
    segments: mockSegments,
    setSegments: mockSetSegments,
    activeUserPage: mockActiveUserPage,
    updateActiveUserPage: mockUpdateActiveUserPage,
  })

  const props = {
    userPage: mockSegments[1].userPages[1],
  }

  render(<SegmentsSeparator {...props} />)

  const separatorContainer = screen.getByTestId(mockContainerId)
  await userEvent.click(separatorContainer)

  expect(mockUpdateActiveUserPage).toHaveBeenCalledTimes(1)
  expect(mockUpdateActiveUserPage).toHaveBeenCalledWith(
    mockSegments.flatMap((s) => s.userPages),
  )
})

test('calls updateActiveUserPage when merging segments with active user page', async () => {
  jest.clearAllMocks()

  const mockActiveUserPage = mockSegments[1].userPages[0]

  usePdfSegments.mockReturnValueOnce({
    segments: mockSegments,
    setSegments: mockSetSegments,
    activeUserPage: mockActiveUserPage,
    updateActiveUserPage: mockUpdateActiveUserPage,
  })

  const props = {
    userPage: mockSegments[1].userPages[0],
  }

  render(<SegmentsSeparator {...props} />)

  const separatorContainer = screen.getByTestId(mockContainerId)
  await userEvent.click(separatorContainer)

  expect(mockUpdateActiveUserPage).toHaveBeenCalledTimes(1)
})
