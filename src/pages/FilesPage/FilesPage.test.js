
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { useFetchFilesQuery } from '@/apiRTK/filesApi'
import { KnownBusinessEvent } from '@/hooks/useEventSource'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { render } from '@/utils/rendererRTL'
import { FilesPage } from './FilesPage'

jest.mock('@/utils/env', () => mockEnv)

const mockRefetch = jest.fn()

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFilesQuery: jest.fn(() => ({
    data: {},
    isFetching: false,
    refetch: mockRefetch,
  })),
}))

const mockAddEvent = jest.fn()
jest.mock('@/hooks/useEventSource', () => ({
  useEventSource: jest.fn(() => mockAddEvent),
  KnownBusinessEvent: {
    FILE_STATE_UPDATED: 'FileStateUpdated',
  },
}))

jest.mock('@/containers/FilesTable', () => mockShallowComponent('FilesTable'))
jest.mock('@/containers/AvailableFilesToggle', () => mockShallowComponent('AvailableFilesToggle'))

test('renders Files Title', () => {
  render(<FilesPage />)

  expect(screen.getByText(localize(Localization.FILES))).toBeInTheDocument()
})

test('renders Files Table', () => {
  render(<FilesPage />)

  expect(screen.getByTestId('FilesTable')).toBeInTheDocument()
})

test('renders Available Files Toggle', () => {
  render(<FilesPage />)

  expect(screen.getByTestId('AvailableFilesToggle')).toBeInTheDocument()
})

test('calls useFetchFilesQuery with expected params', () => {
  render(<FilesPage />)

  expect(useFetchFilesQuery).nthCalledWith(1, {
    page: 1,
    perPage: 20,
  }, {
    refetchOnMountOrArgChange: true,
  })
})

test('calls addEvent from useEventSource with correct arguments when feature SSE is enabled', () => {
  render(<FilesPage />)

  expect(mockAddEvent).toHaveBeenCalledWith(
    KnownBusinessEvent.FILE_STATE_UPDATED,
    expect.any(Function),
  )
})

test('should not call addEvent from useEventSource when feature SSE is false', () => {
  jest.clearAllMocks()
  ENV.FEATURE_SERVER_SENT_EVENTS = false
  render(<FilesPage />)

  expect(mockAddEvent).not.toHaveBeenCalled()

  ENV.FEATURE_SERVER_SENT_EVENTS = true
})
