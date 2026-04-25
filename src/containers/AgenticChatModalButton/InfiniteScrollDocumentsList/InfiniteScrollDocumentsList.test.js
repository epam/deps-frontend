
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { documentsApi } from '@/api/documentsApi'
import { DocumentFilterKeys, PaginationKeys } from '@/constants/navigation'
import { useAbortRequest } from '@/hooks/useAbortRequest'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { DOCUMENTS_LIST_PER_PAGE } from '../constants'
import { InfiniteScrollDocumentsList } from './InfiniteScrollDocumentsList'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    getDocuments: jest.fn(),
  },
}))

jest.mock('@/containers/InfiniteScroll', () => ({
  InfiniteScroll: ({ loadMore }) => (
    <div
      data-testid='infinite-scroll'
      onClick={loadMore}
    />
  ),
}))

jest.mock('@/hooks/useAbortRequest', () => ({
  useAbortRequest: jest.fn(() => ({
    signal: mockSignal,
    isCanceled: jest.fn(() => false),
  })),
}))

const mockSignal = {}
const mockDocumentId1 = 'id1'
const mockDocumentId2 = 'id2'
const mockChild = <div>Child</div>

const mockSetDocumentsById = jest.fn()
const mockUseChatSettings = jest.fn()

jest.mock('../hooks', () => ({
  useChatSettings: () => mockUseChatSettings(),
}))

const defaultProps = {
  areConversationsFetching: false,
  children: mockChild,
  documentsById: {},
  documentsIds: [],
  fetchConversations: jest.fn(),
  setDocumentsById: mockSetDocumentsById,
  hasMore: false,
}

beforeEach(() => {
  jest.clearAllMocks()

  mockUseChatSettings.mockReturnValue({
    pagination: mockPage,
  })
})

const mockPage = 1

test('renders passed children and InfiniteScroll when no fetching', async () => {
  render(<InfiniteScrollDocumentsList {...defaultProps} />)

  expect(screen.getByText('Child')).toBeInTheDocument()
  expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument()
})

test('shows Spin when conversations fetching is in progress', async () => {
  render(
    <InfiniteScrollDocumentsList
      {...defaultProps}
      areConversationsFetching={true}
    />,
  )

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('shows Spin when document details fetching is in progress', () => {
  jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()])

  render(<InfiniteScrollDocumentsList {...defaultProps} />)

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('fetches documents details and saves received data', async () => {
  documentsApi.getDocuments.mockResolvedValueOnce({
    result: [
      {
        _id: mockDocumentId1,
        title: 'Title 1',
      },
      {
        _id: mockDocumentId2,
        title: 'Title 2',
      },
    ],
  })

  render(
    <InfiniteScrollDocumentsList
      {...defaultProps}
      documentsIds={[mockDocumentId1, mockDocumentId2]}
    />,
  )

  await waitFor(() => {
    expect(documentsApi.getDocuments).nthCalledWith(
      1,
      {
        [DocumentFilterKeys.FILTER_IDS]: [mockDocumentId1, mockDocumentId2],
        [PaginationKeys.PER_PAGE]: DOCUMENTS_LIST_PER_PAGE,
      },
      { signal: mockSignal })
  })
  expect(mockSetDocumentsById).toHaveBeenCalled()
})

test('shows notification on fetch error', async () => {
  documentsApi.getDocuments.mockRejectedValueOnce(new Error('test error'))

  render(
    <InfiniteScrollDocumentsList
      {...defaultProps}
      documentsIds={[mockDocumentId1, mockDocumentId2]}
    />,
  )

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
  })
})

test('should not show warning notification if request was aborted', async () => {
  useAbortRequest.mockImplementationOnce(() => ({
    signal: mockSignal,
    isCanceled: () => true,
  }))

  documentsApi.getDocuments.mockRejectedValueOnce(new Error('test error'))

  render(
    <InfiniteScrollDocumentsList
      {...defaultProps}
      documentsIds={[mockDocumentId1, mockDocumentId2]}
    />,
  )

  await waitFor(() => {
    expect(notifyWarning).not.toHaveBeenCalled()
  })
})

test('calls fetchConversations with next page if all conversations was not fetched yet', async () => {
  render(
    <InfiniteScrollDocumentsList
      {...defaultProps}
      hasMore={true}
    />,
  )

  await userEvent.click(screen.getByTestId('infinite-scroll'))

  expect(defaultProps.fetchConversations).nthCalledWith(1, mockPage + 1)
})
