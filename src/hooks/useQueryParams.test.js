
/* eslint-disable max-len */
import { renderHook } from '@testing-library/react-hooks/dom'
import { useQueryParams } from './useQueryParams'

const mockReplace = jest.fn()

const mockQuery = [
  'agent=hi',
  'bool=true',
  'conversationId=123',
  'endDate=2024-09-19T20%3A59%3A59.999Z',
  'page=1',
  'perPage=20',
  'reviewer=hola',
  'sortDirect=ascend',
  'sortField=agent',
  'startDate=2024-09-01T21%3A00%3A00.000Z',
  'state=failed',
  'state=inReview',
  'title=there',
]

const mockQueryString = `?${mockQuery.join('&')}`

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(() => ({
    search: mockQueryString,
  })),
  useHistory: jest.fn(() => ({
    replace: mockReplace,
  })),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns correct fields', () => {
  const { result } = renderHook(() => useQueryParams())
  const { queryParams, setQueryParams, updateQueryParams } = result.current

  expect(queryParams).toEqual({
    agent: 'hi',
    bool: true,
    conversationId: '123',
    endDate: '2024-09-19T20:59:59.999Z',
    page: '1',
    perPage: '20',
    reviewer: 'hola',
    sortDirect: 'ascend',
    sortField: 'agent',
    startDate: '2024-09-01T21:00:00.000Z',
    state: ['failed', 'inReview'],
    title: 'there',
  })
  expect(setQueryParams).toEqual(expect.any(Function))
  expect(updateQueryParams).toEqual(expect.any(Function))
})

test('calls history.replace with correct args once when setQueryParams is called', () => {
  const { result } = renderHook(() => useQueryParams())

  const { setQueryParams } = result.current
  setQueryParams({ hola: 'amigo' })

  expect(mockReplace).nthCalledWith(1, { search: 'hola=amigo' })
})

test('calls history.replace with correct args once when updateQueryParams is called', () => {
  const { result } = renderHook(() => useQueryParams())

  const { updateQueryParams } = result.current
  updateQueryParams({ z: 'a' })

  const expectedQResult = mockQueryString.replace('?', '') + '&z=a'

  expect(mockReplace).nthCalledWith(1, { search: expectedQResult })
})
