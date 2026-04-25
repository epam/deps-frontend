
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { useFetchBatchesQuery } from '@/apiRTK/batchesApi'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { BatchesPage } from '.'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/batchesApi', () => ({
  useFetchBatchesQuery: jest.fn(() => ({
    data: {},
    isFetching: false,
  })),
}))

jest.mock('@/containers/BatchesTable', () => mockShallowComponent('BatchesTable'))
jest.mock('./BatchesPageActions', () => mockShallowComponent('BatchesPageActions'))

test('renders Batches Title', () => {
  render(<BatchesPage />)

  expect(screen.getByText(localize(Localization.BATCHES))).toBeInTheDocument()
})

test('renders Batches Table', () => {
  render(<BatchesPage />)

  expect(screen.getByTestId('BatchesTable')).toBeInTheDocument()
})

test('renders BatchesPageActions', () => {
  render(<BatchesPage />)

  expect(screen.getByTestId('BatchesPageActions')).toBeInTheDocument()
})

test('calls useFetchBatchesQuery with expected params', () => {
  render(<BatchesPage />)

  expect(useFetchBatchesQuery).nthCalledWith(1, {
    page: 0,
    perPage: 20,
  }, {
    refetchOnMountOrArgChange: true,
  })
})
