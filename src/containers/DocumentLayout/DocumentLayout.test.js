
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import { useFetchParsingInfoQuery } from '@/apiRTK/documentLayoutApi'
import { DocumentState } from '@/enums/DocumentState'
import { Localization, localize } from '@/localization/i18n'
import { documentSelector } from '@/selectors/documentReviewPage'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { DocumentLayout } from './DocumentLayout'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/components/Spin', () => mockShallowComponent('Spin'))
jest.mock('@/containers/ParsingLayout/EntityLayout', () => mockShallowComponent('EntityLayout'))
jest.mock('@/apiRTK/documentLayoutApi', () => ({
  useFetchParsingInfoQuery: jest.fn(),
}))

beforeEach(() => {
  jest.clearAllMocks()
  documentSelector.mockImplementation(() => ({
    _id: 'doc-id',
    state: DocumentState.IN_REVIEW,
  }))
})

test('renders spinner when api request is in progress', () => {
  useFetchParsingInfoQuery.mockReturnValue({
    data: null,
    isFetching: true,
    isError: false,
    refetch: jest.fn(),
  })

  render(<DocumentLayout />)

  expect(screen.getByTestId('Spin')).toBeInTheDocument()
})

test('renders EntityLayout when api request is successful', () => {
  useFetchParsingInfoQuery.mockReturnValue({
    data: { documentLayoutInfo: {} },
    isFetching: false,
    isError: false,
    refetch: jest.fn(),
  })

  render(<DocumentLayout />)

  expect(screen.getByTestId('EntityLayout')).toBeInTheDocument()
})

test('displays warning notification when api request fails', () => {
  jest.clearAllMocks()

  useFetchParsingInfoQuery.mockReturnValue({
    data: null,
    isFetching: false,
    isError: true,
    refetch: jest.fn(),
  })

  render(<DocumentLayout />)

  expect(notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
})

test('calls refetch when document state changes', () => {
  jest.clearAllMocks()

  const refetch = jest.fn()
  useFetchParsingInfoQuery.mockReturnValue({
    data: { documentLayoutInfo: {} },
    isFetching: false,
    isError: false,
    refetch,
  })

  const { rerender } = render(<DocumentLayout />)

  documentSelector.mockImplementation(() => ({
    _id: 'doc-id',
    state: DocumentState.COMPLETED,
  }))
  rerender(<DocumentLayout />)

  expect(refetch).toHaveBeenCalled()
})

test('calls refetch when document id changes', () => {
  jest.clearAllMocks()

  const refetch = jest.fn()
  useFetchParsingInfoQuery.mockReturnValue({
    data: { documentLayoutInfo: {} },
    isFetching: false,
    isError: false,
    refetch,
  })

  const { rerender } = render(<DocumentLayout />)

  documentSelector.mockImplementation(() => ({
    _id: 'new-doc-id',
    state: DocumentState.IN_REVIEW,
  }))
  rerender(<DocumentLayout />)

  expect(refetch).toHaveBeenCalled()
})

test('does not show warning notification when fetching is in progress', () => {
  jest.clearAllMocks()

  useFetchParsingInfoQuery.mockReturnValue({
    data: null,
    isFetching: true,
    isError: true,
    refetch: jest.fn(),
  })

  render(<DocumentLayout />)

  expect(notifyWarning).not.toHaveBeenCalled()
})

test('calls useFetchParsingInfoQuery with correct document id', () => {
  jest.clearAllMocks()

  documentSelector.mockImplementation(() => ({
    _id: 'test-doc-id',
    state: DocumentState.IN_REVIEW,
  }))

  useFetchParsingInfoQuery.mockReturnValue({
    data: { documentLayoutInfo: {} },
    isFetching: false,
    isError: false,
    refetch: jest.fn(),
  })

  render(<DocumentLayout />)

  expect(useFetchParsingInfoQuery).toHaveBeenCalledWith('test-doc-id')
})

test('calls refetch on initial render', () => {
  jest.clearAllMocks()

  const refetch = jest.fn()
  useFetchParsingInfoQuery.mockReturnValue({
    data: { documentLayoutInfo: {} },
    isFetching: false,
    isError: false,
    refetch,
  })

  render(<DocumentLayout />)

  expect(refetch).toHaveBeenCalled()
})

test('handles multiple state changes correctly', () => {
  jest.clearAllMocks()

  const refetch = jest.fn()
  useFetchParsingInfoQuery.mockReturnValue({
    data: { documentLayoutInfo: {} },
    isFetching: false,
    isError: false,
    refetch,
  })

  const { rerender } = render(<DocumentLayout />)

  documentSelector.mockImplementation(() => ({
    _id: 'doc-id',
    state: DocumentState.COMPLETED,
  }))
  rerender(<DocumentLayout />)

  documentSelector.mockImplementation(() => ({
    _id: 'doc-id',
    state: DocumentState.IN_REVIEW,
  }))
  rerender(<DocumentLayout />)

  expect(refetch).toHaveBeenCalledTimes(3)
})
