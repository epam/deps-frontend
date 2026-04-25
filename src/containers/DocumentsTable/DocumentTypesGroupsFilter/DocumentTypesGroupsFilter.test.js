
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { useFetchDocumentTypesGroupsQuery } from '@/apiRTK/documentTypesGroupsApi'
import { DocumentTypesGroupsFilterKey, PaginationKeys } from '@/constants/navigation'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { render } from '@/utils/rendererRTL'
import { DocumentTypesGroupsFilter } from './DocumentTypesGroupsFilter'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('lodash/debounce', () =>
  jest.fn((fn) => fn),
)

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useFetchDocumentTypesGroupsQuery: jest.fn(() => ({
    data: {},
    isFetching: false,
  })),
}))

const mockConfirm = jest.fn()
const mockSetSelectedKeys = jest.fn()

const defaultProps = {
  confirm: mockConfirm,
  selectedKeys: [],
  setSelectedKeys: mockSetSelectedKeys,
  visible: true,
}

const mockGroups = [
  new DocumentTypesGroup({
    id: 'id1',
    name: 'Group1',
    documentTypeIds: ['1', '2'],
    createdAt: '2012-12-12',
  }),
  new DocumentTypesGroup({
    id: 'id2',
    name: 'Group2',
    documentTypeIds: ['1', '2'],
    createdAt: '2012-11-11',
  }),
]

const mockDocTypesGroupsData = {
  meta: {
    size: 10,
    total: 100,
  },
  result: mockGroups,
}

const mockDocTypesGroupsResponse = {
  data: mockDocTypesGroupsData,
  isFetching: false,
}

test('renders search and filter options', async () => {
  useFetchDocumentTypesGroupsQuery.mockReturnValueOnce(mockDocTypesGroupsResponse)

  render(<DocumentTypesGroupsFilter {...defaultProps} />)

  expect(screen.getByRole('textbox')).toBeInTheDocument()

  mockGroups.forEach((g, i) => {
    const option = screen.getAllByRole('listitem')[i]
    expect(option).toHaveTextContent(g.name)
  })
})

test('calls fetch groups with correct initial filter config', async () => {
  render(<DocumentTypesGroupsFilter {...defaultProps} />)

  await waitFor(() => {
    expect(useFetchDocumentTypesGroupsQuery).nthCalledWith(1, {
      [PaginationKeys.PER_PAGE]: 30,
      [PaginationKeys.PAGE]: 0,
    })
  })
})

test('displays loading spinner when fetching', async () => {
  useFetchDocumentTypesGroupsQuery.mockReturnValue({
    data: {},
    isFetching: true,
  })

  render(<DocumentTypesGroupsFilter {...defaultProps} />)

  await waitFor(() => {
    expect(screen.getAllByTestId('spin')[1]).toHaveClass('ant-spin-spinning')
  })
})

test('fetches groups by search value', async () => {
  render(<DocumentTypesGroupsFilter {...defaultProps} />)

  jest.clearAllMocks()

  const input = screen.getByRole('textbox')
  const mockSearchValue = '1'

  await userEvent.type(input, mockSearchValue)

  expect(useFetchDocumentTypesGroupsQuery).nthCalledWith(1, {
    [PaginationKeys.PER_PAGE]: 30,
    [PaginationKeys.PAGE]: 0,
    [DocumentTypesGroupsFilterKey.NAME]: mockSearchValue,
  })
})
