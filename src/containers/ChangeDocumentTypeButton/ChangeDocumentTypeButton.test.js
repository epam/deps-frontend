
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { useFetchDocumentTypesGroupQuery } from '@/apiRTK/documentTypesGroupsApi'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { areTypesFetchingSelector } from '@/selectors/requests'
import { render } from '@/utils/rendererRTL'
import { ChangeDocumentTypeButton } from './ChangeDocumentTypeButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/selectors/documentTypesListPage')
jest.mock('@/selectors/requests')

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

jest.mock('@/actions/documentTypes', () => ({
  fetchDocumentTypes: jest.fn(() => ({ type: 'FETCH_DOCUMENT_TYPES' })),
}))

const mockChildren = 'Change Document Type'
const mockId = 'groupId'

const mockDocTypesGroupResponse = {
  data: {
    group: new DocumentTypesGroup({
      id: 'id1',
      name: 'Group1',
      documentTypeIds: ['testType1', 'testType2'],
      createdAt: '2012-12-12',
    }),
  },
  isFetching: false,
  error: null,
}

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useFetchDocumentTypesGroupQuery: jest.fn(() => mockDocTypesGroupResponse),
}))

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({
    groupId: mockId,
  })),
}))

describe('ChangeDocumentTypeButton', () => {
  let defaultProps

  beforeEach(() => {
    jest.clearAllMocks()
    documentTypesSelector.mockReturnValue([
      new DocumentType('testType1', 'Type 1', 'engine1'),
      new DocumentType('testType2', 'Type 2', 'engine2'),
      new DocumentType('testType3', 'Type 3', 'engine3'),
    ])
    areTypesFetchingSelector.mockReturnValue(false)
    defaultProps = {
      disabled: false,
      documentType: new DocumentType('testType1', 'Type 1', 'engine1'),
      updateDocumentType: jest.fn(),
    }
  })

  test('renders ChangeDocumentTypeButton with children', () => {
    render(
      <ChangeDocumentTypeButton {...defaultProps}>
        {mockChildren}
      </ChangeDocumentTypeButton>,
    )
    expect(screen.getByText(mockChildren)).toBeInTheDocument()
  })

  test('dispatches fetchDocumentTypes on mount', () => {
    render(
      <ChangeDocumentTypeButton {...defaultProps}>
        {mockChildren}
      </ChangeDocumentTypeButton>,
    )
    expect(mockDispatch).toHaveBeenCalledWith(fetchDocumentTypes())
  })

  test('calls updateDocumentType on confirm', async () => {
    render(
      <ChangeDocumentTypeButton {...defaultProps}>
        {mockChildren}
      </ChangeDocumentTypeButton>,
    )
    await userEvent.click(screen.getByText(mockChildren))
    await userEvent.click(screen.getByText('Type 2'))

    const saveButton = screen.getByRole('button', { name: localize(Localization.CONFIRM) })
    await userEvent.click(saveButton)
    expect(defaultProps.updateDocumentType).toHaveBeenCalled()
  })

  test('should pass filtered document types to SelectOptionModalButton when group exists', async () => {
    render(
      <ChangeDocumentTypeButton {...defaultProps}>
        {mockChildren}
      </ChangeDocumentTypeButton>,
    )
    await userEvent.click(screen.getByText(mockChildren))

    expect(screen.getByText('Type 1')).toBeInTheDocument()
    expect(screen.getByText('Type 2')).toBeInTheDocument()
    expect(screen.queryByText('Type 3')).not.toBeInTheDocument()
  })

  test('should pass correct document types to SelectOptionModalButton if there is no group', async () => {
    useFetchDocumentTypesGroupQuery.mockReturnValue({
      data: null,
      isFetching: false,
      error: null,
    })

    render(
      <ChangeDocumentTypeButton {...defaultProps}>
        {mockChildren}
      </ChangeDocumentTypeButton>,
    )

    await userEvent.click(screen.getByText(mockChildren))

    expect(screen.getByText('Type 1')).toBeInTheDocument()
    expect(screen.getByText('Type 2')).toBeInTheDocument()
    expect(screen.getByText('Type 3')).toBeInTheDocument()
  })

  test('should call useFetchDocumentTypesGroupQuery with skip: true when groupId is not provided', () => {
    render(
      <ChangeDocumentTypeButton {...defaultProps}>
        {mockChildren}
      </ChangeDocumentTypeButton>,
    )
    expect(useFetchDocumentTypesGroupQuery).toHaveBeenCalledWith(
      { groupId: undefined },
      { skip: true },
    )
  })
})
