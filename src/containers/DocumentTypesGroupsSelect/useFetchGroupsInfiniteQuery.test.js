
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { useFetchDocumentTypesGroupsQuery } from '@/apiRTK/documentTypesGroupsApi'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { useFetchGroupsInfiniteQuery } from './useFetchGroupsInfiniteQuery'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useFetchDocumentTypesGroupsQuery: jest.fn(() => ({
    data: {},
    isFetching: false,
  })),
}))

const mockGroup1 = new DocumentTypesGroup({
  id: 'id1',
  name: 'Group1',
  documentTypeIds: ['code1', 'code2'],
  createdAt: '2012-12-12',
})

const mockGroup2 = new DocumentTypesGroup({
  id: 'id2',
  name: 'Group2',
  documentTypeIds: ['code1', 'code2'],
  createdAt: '2012-11-12',
})

const mockDataPage1 = {
  result: [mockGroup1],
  meta: { total: 2 },
}

const mockDataPage2 = {
  result: [mockGroup2],
  meta: { total: 2 },
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns default values on initial render', () => {
  useFetchDocumentTypesGroupsQuery.mockReturnValue({
    data: {},
    isFetching: false,
  })

  const { result } = renderHook(() => useFetchGroupsInfiniteQuery({
    filter: {},
    skip: false,
  }))

  expect(result.current.groups).toEqual([])
  expect(result.current.total).toEqual(0)
  expect(result.current.isFetching).toBe(false)
})

test('appends new groups when data.result changes', () => {
  let data = mockDataPage1

  useFetchDocumentTypesGroupsQuery.mockImplementation(() => ({
    data,
    isFetching: false,
  }))

  const { result, rerender } = renderHook(({ filter, skip }) =>
    useFetchGroupsInfiniteQuery({
      filter,
      skip,
    }),
  {
    initialProps: {
      filter: {},
      skip: false,
    },
  },
  )

  expect(result.current.groups).toEqual(mockDataPage1.result)

  data = mockDataPage2
  rerender({
    filter: {},
    skip: false,
  })

  expect(result.current.groups).toEqual([
    ...mockDataPage1.result,
    ...mockDataPage2.result,
  ])
})

test('does not fetch data when skip is true', () => {
  useFetchDocumentTypesGroupsQuery.mockReturnValue({
    data: {},
    isFetching: false,
  })

  renderHook(() => useFetchGroupsInfiniteQuery({
    filter: {},
    skip: true,
  }))

  expect(useFetchDocumentTypesGroupsQuery).toHaveBeenCalledWith(
    {},
    { skip: true },
  )
})
