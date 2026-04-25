
import { mockButton } from '@/mocks/mockButton'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { updateExtractedData } from '@/actions/documents'
import { documentsApi } from '@/api/documentsApi'
import { ActionsMenu } from '@/containers/ActionsMenu'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import {
  Cell,
  ExtractedDataField,
  TableData,
} from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { documentSelector, idSelector } from '@/selectors/documentReviewPage'
import { notifyError } from '@/utils/notification'
import { TableEdFieldActionsMenu } from './TableEdFieldActionsMenu'

jest.mock('@/containers/ActionsMenu', () => {
  const { ActionsMenu } = jest.requireActual('@/containers/ActionsMenu')
  ActionsMenu.ItemButton = mockButton().Button
  return { ActionsMenu }
})

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/documentReviewPage')
jest.mock('../useFieldProps', () => ({
  useFieldProps: jest.fn(() => ({
    onChangeData: jest.fn(),
    onFocus: jest.fn(),
    setHighlightedField: jest.fn(),
    highlightArea: jest.fn(),
    revertValue: jest.fn(),
    isRevertDisabled: false,
  })),
}))
jest.mock('../useCommandExtractionProps', () => ({
  useCommandExtractionProps: jest.fn(() => ({
    openExtractAreaModal: jest.fn(),
    isExtractionDisabled: false,
  })),
}))
jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    deleteEdFields: jest.fn(),
  },
}))
jest.mock('@/actions/documents', () => ({
  updateExtractedData: jest.fn(),
}))
jest.mock('@/utils/notification', () => ({
  notifyError: jest.fn(),
}))
jest.mock('@/utils/env', () => mockEnv)

const BUTTON_INDEXES = {
  DELETE_VALUE: 2,
}

const mockError = new Error('Mock Error Message')

const cells = [
  new Cell(0, 0, '0 1', 2, 2, 1, 0.1),
  new Cell(0, 2, '0 3', 1, 2, 1, 0.1),
]
const mockFile = {
  blobName: 'test.txt',
  url: 'test.txt',
}
const mockDocument = documentSelector.getSelectorMockValue()

const mockFiledType = new DocumentTypeField(
  'table',
  'Table',
  null,
  FieldType.TABLE,
  false,
  0,
  'mockDocumentTypeCode',
  1,
)

const mockDataField = new ExtractedDataField(
  1,
  new TableData(1, [], [], cells, new FieldCoordinates(1, 0.10, 0.10, 0.10, 0.10)),
)

describe('Container: TableEdFieldActionsMenu', () => {
  let defaultProps, wrapper

  beforeEach(() => {
    documentSelector.mockImplementation(() => ({
      ...mockDocument,
      extractedData: [
        mockDataField,
      ],
      initialDocumentData: [
        mockDataField,
      ],
      files: [
        mockFile,
      ],
    }))

    defaultProps = {
      disabled: false,
      dtField: mockFiledType,
      edField: mockDataField,
    }

    wrapper = shallow(<TableEdFieldActionsMenu {...defaultProps} />)
    jest.clearAllMocks()
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render extra actions if passed', () => {
    const mockExtraActionContent = 'mockExtraActionContent'

    defaultProps.extraActions = [{ content: () => mockExtraActionContent }]
    wrapper.setProps(defaultProps)

    const menuItems = wrapper.find(ActionsMenu).props().items
    const extraActionItem = menuItems[menuItems.length - 1]

    expect(extraActionItem.content()).toEqual(mockExtraActionContent)
  })

  it('should render disabled Delete button if field dont have any extracted data', () => {
    const deleteButton = shallow(wrapper.props().items[BUTTON_INDEXES.DELETE_VALUE].content())
    expect(deleteButton.props().disabled).toBe(true)
  })

  it('should render disabled Delete button if field have extracted data', () => {
    defaultProps.edField = {
      data: {
        calle: [{
          value: 'mockValue',
        }],
      },
    }
    wrapper.setProps(defaultProps)
    const deleteButton = shallow(wrapper.props().items[BUTTON_INDEXES.DELETE_VALUE].content())
    expect(deleteButton.props().disabled).toBe(false)
  })

  it('should pass correct arguments for documentsApi.deleteEdFields when clicking on Delete button', async () => {
    const deleteButton = shallow(wrapper.props().items[BUTTON_INDEXES.DELETE_VALUE].content())
    await deleteButton.props().onClick()
    expect(documentsApi.deleteEdFields).toHaveBeenNthCalledWith(
      1,
      {
        documentPk: idSelector.getSelectorMockValue(),
        fieldPks: [mockFiledType.pk],
      },
    )
  })

  it('should call updateExtractedData once with correct argument when clicking on Delete button', async () => {
    const deleteButton = shallow(wrapper.props().items[BUTTON_INDEXES.DELETE_VALUE].content())
    await deleteButton.props().onClick()
    expect(updateExtractedData).toHaveBeenNthCalledWith(
      1,
      idSelector.getSelectorMockValue(),
      [],
    )
  })

  it('should call notifyError with correct message if field deletion failed', async () => {
    documentsApi.deleteEdFields.mockImplementationOnce(() => Promise.reject(mockError))
    const deleteButton = shallow(wrapper.props().items[BUTTON_INDEXES.DELETE_VALUE].content())
    await deleteButton.props().onClick()
    expect(notifyError).toHaveBeenNthCalledWith(1, localize(Localization.FALLBACK_INFO))
  })
})
