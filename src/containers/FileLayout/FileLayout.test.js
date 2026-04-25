
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/react'
import React from 'react'
import { useFetchFileParsingInfoQuery } from '@/apiRTK/fileLayoutApi'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { FileStatus } from '@/enums/FileStatus'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { FileLayout } from './FileLayout'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ fileId: mockFileId })),
}))
jest.mock('@/apiRTK/fileLayoutApi', () => ({
  useFetchFileParsingInfoQuery: jest.fn(() => mockFetchFileParsingInfoQuery),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileQuery: jest.fn(() => ({ data: mockFile })),
}))

jest.mock('@/containers/ParsingLayout/EntityLayout', () => mockShallowComponent('EntityLayout'))
jest.mock('@/containers/ParsingLayout/TabularLayout', () => mockShallowComponent('TabularLayout'))

const mockFileId = 'test-file-id-123'
const mockRefetch = jest.fn()

const mockFile = {
  id: mockFileId,
  name: 'Test File',
  state: {
    status: FileStatus.IN_REVIEW,
  },
}

const mockParsingInfoData = {
  documentLayoutInfo: {
    parsingFeatures: {
      user_defined: ['TEXT', 'TABLES'],
    },
    mergedTables: {},
    pagesInfo: {
      user_defined: {
        pagesCount: 5,
      },
    },
  },
}

const mockFetchFileParsingInfoQuery = {
  data: mockParsingInfoData,
  isFetching: false,
  isError: false,
  refetch: mockRefetch,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders loading spinner when parsing info is fetching', () => {
  useFetchFileParsingInfoQuery.mockReturnValueOnce({
    ...mockFetchFileParsingInfoQuery,
    isFetching: true,
  })

  render(<FileLayout />)

  const spinner = screen.getByTestId('spin')

  expect(spinner).toBeInTheDocument()
})

test('renders TabularLayout when tabularLayoutInfo exists', () => {
  useFetchFileParsingInfoQuery.mockReturnValueOnce({
    data: {
      tabularLayoutInfo: {
        id: 'test-id',
        parsingType: 'EXCEL',
        sheets: [],
      },
    },
    isFetching: false,
    isError: false,
    refetch: mockRefetch,
  })

  render(<FileLayout />)

  const tabularLayout = screen.getByTestId('TabularLayout')

  expect(tabularLayout).toBeInTheDocument()
})

test('renders NoData when documentLayoutInfo does not exist and no tabularLayoutInfo', () => {
  useFetchFileParsingInfoQuery.mockReturnValueOnce({
    data: {},
    isFetching: false,
    isError: false,
    refetch: mockRefetch,
  })

  render(<FileLayout />)

  const noData = screen.getByText(localize(Localization.NOTHING_TO_DISPLAY))

  expect(noData).toBeInTheDocument()
})

test('renders EntityLayout when documentLayoutInfo exists', () => {
  render(<FileLayout />)

  const entityLayout = screen.getByTestId('EntityLayout')
  expect(entityLayout).toBeInTheDocument()
})

test('calls useFetchFileQuery with correct fileId', () => {
  render(<FileLayout />)

  expect(useFetchFileQuery).toHaveBeenCalledWith(mockFileId)
})

test('calls useFetchFileParsingInfoQuery with correct fileId', () => {
  render(<FileLayout />)

  expect(useFetchFileParsingInfoQuery).toHaveBeenCalledWith(mockFileId)
})

test('calls refetch when file state status changes', () => {
  jest.clearAllMocks()

  const { rerender } = render(<FileLayout />)

  const initialCallCount = mockRefetch.mock.calls.length

  useFetchFileQuery.mockReturnValueOnce({
    data: {
      ...mockFile,
      state: {
        status: FileStatus.COMPLETED,
      },
    },
  })

  rerender(<FileLayout />)

  expect(mockRefetch.mock.calls.length).toBeGreaterThan(initialCallCount)
})

test('shows error notification when parsing info has error and not fetching', async () => {
  useFetchFileParsingInfoQuery.mockReturnValue({
    data: null,
    isFetching: false,
    isError: true,
    refetch: mockRefetch,
  })

  render(<FileLayout />)

  await waitFor(() => {
    expect(mockNotification.notifyWarning).toHaveBeenCalledWith(
      localize(Localization.DEFAULT_ERROR),
    )
  })
})

test('does not show error notification when fetching', () => {
  useFetchFileParsingInfoQuery.mockReturnValue({
    data: null,
    isFetching: true,
    isError: true,
    refetch: mockRefetch,
  })

  render(<FileLayout />)

  expect(mockNotification.notifyWarning).not.toHaveBeenCalled()
})

test('renders NoData when data is null', () => {
  useFetchFileParsingInfoQuery.mockReturnValue({
    data: null,
    isFetching: false,
    isError: false,
    refetch: mockRefetch,
  })

  render(<FileLayout />)

  const noData = screen.getByText(localize(Localization.NOTHING_TO_DISPLAY))

  expect(noData).toBeInTheDocument()
})
