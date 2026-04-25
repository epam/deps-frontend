
import { mockShallowComponent } from '@/mocks/mockComponent'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { useFetchBatchQuery } from '@/apiRTK/batchesApi'
import { StatusCode } from '@/enums/StatusCode'
import { BatchPage } from '.'

jest.mock('@/pages/BatchPage/BatchFilesTable', () => mockShallowComponent('BatchFilesTable'))
jest.mock('@/pages/BatchPage/BatchFilesCounter', () => mockShallowComponent('BatchFilesCounter'))
jest.mock('@/components/Layout', () => mockShallowComponent('Content'))
jest.mock('@/pages/BatchPage/BatchPageHeader', () => mockShallowComponent('BatchPageHeader'))

jest.mock('@/apiRTK/batchesApi', () => ({
  useFetchBatchQuery: jest.fn(() => ({
    data: [{
      name: 'hola',
    }],
    isFetching: false,
  })),
}))

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({
    id: 1,
  })),
  Redirect: jest.fn(() => <div data-testid="Redirect" />),
}))

test('renders Batch Files Table', () => {
  render(<BatchPage />)

  expect(screen.getByTestId('BatchFilesTable')).toBeInTheDocument()
})

test('renders Batch Page Header', () => {
  render(<BatchPage />)

  expect(screen.getByTestId('BatchPageHeader')).toBeInTheDocument()
})

test('renders Batch Files Counter', () => {
  render(<BatchPage />)

  expect(screen.getByTestId('BatchFilesCounter')).toBeInTheDocument()
})

test('renders Spinner when fetching', () => {
  useFetchBatchQuery.mockReturnValueOnce({
    isFetching: true,
  })

  render(<BatchPage />)

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('renders Redirect when 404 error occurs', () => {
  useFetchBatchQuery.mockReturnValueOnce({
    isFetching: false,
    isError: true,
    error: {
      status: StatusCode.NOT_FOUND,
    },
  })

  render(<BatchPage />)

  expect(screen.getByTestId('Redirect')).toBeInTheDocument()
})
