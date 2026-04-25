
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/dom'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { useFetchDocumentTypesGroupQuery } from '@/apiRTK/documentTypesGroupsApi'
import { StatusCode } from '@/enums/StatusCode'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { navigationMap } from '@/utils/navigationMap'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { goTo } from '@/utils/routerActions'
import { DocumentTypesGroupDetailsPage } from './DocumentTypesGroupDetailsPage'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/selectors/documentTypesListPage')
jest.mock('@/selectors/requests')

jest.mock('@/actions/documentTypes', () => ({
  fetchDocumentTypes: jest.fn(),
}))

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useFetchDocumentTypesGroupQuery: jest.fn(() => mockDocTypesGroupResponse),
}))

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({
    groupId: mockId,
  })),
}))

jest.mock('./DocumentTypesGroupHeader', () => ({
  DocumentTypesGroupHeader: () => <div data-testid='dt-group-header' />,
}))

jest.mock('@/containers/GroupDocumentTypesList', () => ({
  GroupDocumentTypesList: () => <table data-testid='dt-group-list' />,
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
}))

const mockDispatch = jest.fn()

const mockId = 'groupId'

const mockDocTypesGroupData = {
  group: new DocumentTypesGroup({
    id: 'id1',
    name: 'Group1',
    documentTypeIds: ['testType1', 'testType2'],
    createdAt: '2012-12-12',
  }),
}

const mockDocTypesGroupResponse = {
  data: mockDocTypesGroupData,
  isFetching: false,
  error: null,
}

test('render spinner if data is fetching', () => {
  useFetchDocumentTypesGroupQuery.mockReturnValueOnce(
    {
      ...mockDocTypesGroupResponse,
      isLoading: true,
    },
  )

  render(<DocumentTypesGroupDetailsPage />)

  const spinner = screen.getByTestId('spin')

  expect(spinner).toBeInTheDocument()
})

test('show page header correctly', async () => {
  render(<DocumentTypesGroupDetailsPage />)

  expect(screen.getByTestId('dt-group-header')).toBeInTheDocument()
  expect(screen.getByTestId('dt-group-list')).toBeInTheDocument()
})

test('calls goTo with correct args if documentTypesGroup request is failed with 404 status code', () => {
  jest.clearAllMocks()

  useFetchDocumentTypesGroupQuery.mockReturnValueOnce(
    {
      ...mockDocTypesGroupResponse,
      error: { status: StatusCode.NOT_FOUND },
    },
  )

  render(<DocumentTypesGroupDetailsPage />)

  expect(goTo).nthCalledWith(1, navigationMap.error.notFound())
})

test('calls notifyWarning with correct message if documentTypesGroup request is failed with not a 404 status code', () => {
  jest.clearAllMocks()

  useFetchDocumentTypesGroupQuery.mockReturnValueOnce(
    {
      ...mockDocTypesGroupResponse,
      error: {},
    },
  )

  render(<DocumentTypesGroupDetailsPage />)

  expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR_MESSAGE))
})

test('calls goTo with correct args if documentTypesGroup request is failed with not a 404 status code', () => {
  useFetchDocumentTypesGroupQuery.mockReturnValueOnce(
    {
      ...mockDocTypesGroupResponse,
      error: {},
    },
  )

  render(<DocumentTypesGroupDetailsPage />)

  expect(goTo).nthCalledWith(1, navigationMap.documentTypesGroups())
})

test('calls dispatch with fetchDocumentTypes action if documentTypes are empty', () => {
  documentTypesSelector.mockReturnValueOnce([])

  render(<DocumentTypesGroupDetailsPage />)

  expect(mockDispatch).nthCalledWith(1, fetchDocumentTypes())
})
