
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { ButtonType } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { DocumentColumn } from '@/containers/DocumentsTable/columns/DocumentColumn'
import { ContainerType } from '@/enums/ContainerType'
import { DocumentState } from '@/enums/DocumentState'
import { Document, File } from '@/models/Document'
import { DocumentsFilterConfig } from '@/models/DocumentsFilterConfig'
import { PreviewEntity } from '@/models/PreviewEntity'
import { documentsSelector } from '@/selectors/documentsListPage'
import { filterSelector } from '@/selectors/navigation'
import { DocumentsTableCommands } from './DocumentsTableCommands'
import { DocumentTableCommandsBar } from './DocumentsTableCommands.styles'

const mockData = [
  new Document({ id: 'mockDocumentId1' }),
]
const mockValidation = {
  isValid: true,
  detail: [],
}

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/containers/ManageLabelsModalButton', () => mockComponent('ManageLabelsModalButton'))
jest.mock(
  '@/containers/DocumentsTable/DocumentsTableCommands/DownloadMenuCommand',
  () => mockComponent('DownloadMenuCommand'),
)
jest.mock(
  '@/containers/DocumentsTable/DocumentsTableCommands/MoreOptionsCommandMenu',
  () => mockComponent('MoreOptionsCommandMenu'),
)
jest.mock('@/containers/TableColumnsPicker', () => mockComponent('TableColumnsPicker'))
jest.mock('@/selectors/documentsListPage')
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/documentTypesListPage')
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

const { ConnectedComponent } = DocumentsTableCommands

describe('Component: DocumentsTableCommands', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      documents: [
        new Document({
          id: 'mockId',
          state: DocumentState.FAILED,
          error: {
            description: 'mockDescription',
            inState: DocumentState.PREPROCESSING,
          },
          documentType: new PreviewEntity('Test', 'test'),
          containerType: ContainerType.CONTAINER,
          title: 'Title',
          validation: mockValidation,
          files: [
            new File(
              'documentUrl.png',
              'blobName.png',
            ),
          ],
        }),
      ],
      checkedDocuments: ['mockId'],
      deleteDocuments: jest.fn(() => Promise.resolve()),
      filterConfig: new DocumentsFilterConfig(),
      updateType: jest.fn(() => Promise.resolve(mockData)),
      startReview: jest.fn(() => Promise.resolve(mockData)),
      setSelection: jest.fn(),
      tableColumns: [DocumentColumn.TITLE],
      refreshData: jest.fn(),
      resetFilters: jest.fn(),
    }

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    Modal.confirm = jest.fn()
  })

  it('should render DocumentsTableCommands with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render CommandBar for documents managing', () => {
    const { commands } = wrapper.find(DocumentTableCommandsBar).at(0).props()
    expect(commands.map(({ renderComponent }) => renderComponent())).toMatchSnapshot()
  })

  it('should render CommandBar for table managing', () => {
    const { commands } = wrapper.find(DocumentTableCommandsBar).at(1).props()
    expect(commands.map(({ renderComponent }) => renderComponent())).toMatchSnapshot()
  })

  it('should show confirmation dialog on clicking delete document', () => {
    const { commands } = wrapper.find(DocumentTableCommandsBar).at(0).props()
    commands[2].onClick()
    expect(Modal.confirm).nthCalledWith(1,
      {
        title: 'Are you sure you want to delete this document(s)?',
        content: 'Document(s) will be permanently deleted!',
        okText: 'Delete',
        okType: ButtonType.DANGER,
        cancelText: 'Cancel',
        onOk: expect.any(Function),
      })
  })

  it('should call refreshData on refresh button click', () => {
    const { commands } = wrapper.find(DocumentTableCommandsBar).at(1).props()
    const { renderComponent } = commands[0]
    renderComponent().props.children.props.onClick()
    expect(defaultProps.refreshData).toHaveBeenCalled()
  })

  it('should call resetFilters on resetFilters button click', () => {
    const { commands } = wrapper.find(DocumentTableCommandsBar).at(1).props()
    const { renderComponent } = commands[1]
    renderComponent().props.children.props.onClick()
    expect(defaultProps.resetFilters).toHaveBeenCalled()
  })
})

describe('Container: DocumentsTableCommands', () => {
  const { mapStateToProps } = DocumentsTableCommands
  const mockState = 'mockState'

  describe('mapStateToProps', () => {
    it('should call to filterSelector with state and pass the result as filters prop', () => {
      const { props } = mapStateToProps(mockState)

      expect(filterSelector).toHaveBeenCalledWith(mockState)
      expect(props.filters).toEqual(filterSelector.getSelectorMockValue())
    })

    it('should call to documentsSelector with state and pass the result as documents prop', () => {
      const { props } = mapStateToProps(mockState)

      expect(documentsSelector).toHaveBeenCalledWith(mockState)
      expect(props.documents).toEqual(documentsSelector.getSelectorMockValue())
    })
  })
})
