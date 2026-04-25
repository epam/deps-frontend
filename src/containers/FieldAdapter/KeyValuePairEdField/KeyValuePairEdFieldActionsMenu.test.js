
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
import { DictFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { DictFieldData, ExtractedDataField, FieldData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { documentSelector, idSelector } from '@/selectors/documentReviewPage'
import { notifyError } from '@/utils/notification'
import { useCommandExtractionProps } from '../useCommandExtractionProps'
import { useFieldProps } from '../useFieldProps'
import { KeyValuePairEdFieldActionsMenu } from './KeyValuePairEdFieldActionsMenu'

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
    saveEdField: jest.fn(),
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
  EXTRACT: 0,
  DELETE_DATA: 1,
}

const SUBMENU_INDEXES = {
  KEY_ACTIONS: 0,
  VALUE_ACTIONS: 1,
}

const mockError = new Error('Mock Error Message')

const mockFile = {
  blobName: 'test.txt',
  url: 'test.txt',
}
const mockDocument = documentSelector.getSelectorMockValue()

const mockFiledType = new DocumentTypeField(
  'kv',
  'KV',
  new DictFieldMeta(),
  FieldType.DICTIONARY,
  false,
  0,
  'whole',
  1,
)

describe('Container: KeyValuePairEdFieldActionsMenu', () => {
  let defaultProps, wrapper, mockDataField

  beforeEach(() => {
    mockDataField = new ExtractedDataField(
      1,
      new DictFieldData(
        new FieldData(
          'value',
          new FieldCoordinates(1, 3, 3, 3, 3),
          0.6,
        ),
        new FieldData(
          'key',
          new FieldCoordinates(1, 4, 4, 4, 4),
          0.3,
        ),
      ),
    )

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

    wrapper = shallow(<KeyValuePairEdFieldActionsMenu {...defaultProps} />)
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

  it('should disable extract key/value action buttons for DOCX documents format', () => {
    useCommandExtractionProps.mockImplementationOnce(jest.fn(() => ({
      openExtractAreaModal: jest.fn(),
      isExtractionDisabled: true,
    })))
    useFieldProps.mockImplementationOnce(jest.fn(() => ({
      onChangeData: jest.fn(),
      onFocus: jest.fn(),
      setHighlightedField: jest.fn(),
      highlightArea: jest.fn(),
      revertValue: jest.fn(),
      isRevertDisabled: true,
    })))
    const mockDOCXFiles = [{
      blobName: 'test.docx',
      url: 'test.docx',
    }]
    documentSelector.mockImplementationOnce(() => ({
      ...documentSelector.getSelectorMockValue(),
      files: mockDOCXFiles,
    }))

    wrapper.setProps(defaultProps)
    const { items } = wrapper.props()

    const keyActions = items[SUBMENU_INDEXES.KEY_ACTIONS]
    const extractKeyComponent = shallow(keyActions.children[BUTTON_INDEXES.EXTRACT].content())
    expect(extractKeyComponent.props().disabled).toBe(true)

    const valueActions = items[SUBMENU_INDEXES.VALUE_ACTIONS]
    const extractValueComponent = shallow(valueActions.children[BUTTON_INDEXES.EXTRACT].content())
    expect(extractValueComponent.props().disabled).toBe(true)
  })

  it('should render disabled Delete Data button if key/value dont have any extracted data', () => {
    mockDataField.data.key = new FieldData()
    mockDataField.data.value = new FieldData()

    const { items } = wrapper.props()

    const keyActions = items[SUBMENU_INDEXES.KEY_ACTIONS]
    const deleteKeyComponent = shallow(keyActions.children[BUTTON_INDEXES.DELETE_DATA].content())
    expect(deleteKeyComponent.props().disabled).toBe(true)

    const valueActions = items[SUBMENU_INDEXES.VALUE_ACTIONS]
    const deleteValueComponent = shallow(valueActions.children[BUTTON_INDEXES.DELETE_DATA].content())
    expect(deleteValueComponent.props().disabled).toBe(true)
  })

  it('should render enabled Delete button if key/value have extracted data', () => {
    const { items } = wrapper.props()

    const keyActions = items[SUBMENU_INDEXES.KEY_ACTIONS]
    const deleteKeyComponent = shallow(keyActions.children[BUTTON_INDEXES.DELETE_DATA].content())
    expect(deleteKeyComponent.props().disabled).toBe(false)

    const valueActions = items[SUBMENU_INDEXES.VALUE_ACTIONS]
    const deleteValueComponent = shallow(valueActions.children[BUTTON_INDEXES.DELETE_DATA].content())
    expect(deleteValueComponent.props().disabled).toBe(false)
  })

  it('should call documentsApi.saveEdField once with correct arguments if both fields have value', async () => {
    const expectedData = new ExtractedDataField(
      1,
      new DictFieldData(
        new FieldData(),
        new FieldData(
          'key',
          new FieldCoordinates(1, 4, 4, 4, 4),
          0.3,
        ),
      ),
    )

    const keyActions = wrapper.props().items[SUBMENU_INDEXES.KEY_ACTIONS]
    const deleteButton = shallow(keyActions.children[BUTTON_INDEXES.DELETE_DATA].content())

    await deleteButton.props().onClick()
    expect(documentsApi.saveEdField).toHaveBeenNthCalledWith(
      1,
      {
        data: expectedData.data,
        documentPk: idSelector.getSelectorMockValue(),
        fieldPk: 1,
      },
    )
  })

  it('should call documentsApi.deleteEdFields once with correct arguments if only item to be deleted has value', async () => {
    mockDataField.data = new DictFieldData(
      new FieldData('mockedValue'),
      new FieldData(),
    )

    const keyActions = wrapper.props().items[SUBMENU_INDEXES.KEY_ACTIONS]
    const deleteButton = shallow(keyActions.children[BUTTON_INDEXES.DELETE_DATA].content())

    await deleteButton.props().onClick()
    expect(documentsApi.deleteEdFields).toHaveBeenNthCalledWith(
      1, {
        documentPk: idSelector.getSelectorMockValue(),
        fieldPks: [mockFiledType.pk],
      },
    )
  })

  it('should call updateExtractedData once with correct argument when clicking on Delete button', async () => {
    mockDataField.data.value = new FieldData()

    const keyActions = wrapper.props().items[SUBMENU_INDEXES.KEY_ACTIONS]
    const deleteButton = shallow(keyActions.children[BUTTON_INDEXES.DELETE_DATA].content())

    await deleteButton.props().onClick()
    expect(updateExtractedData).toHaveBeenNthCalledWith(
      1,
      idSelector.getSelectorMockValue(),
      [],
    )
  })

  it('should call notifyError with correct message if field deletion failed', async () => {
    documentsApi.deleteEdFields.mockImplementationOnce(() => Promise.reject(mockError))
    mockDataField.data = new DictFieldData(
      new FieldData('mockedValue'),
      new FieldData(),
    )
    const keyActions = wrapper.props().items[SUBMENU_INDEXES.KEY_ACTIONS]
    const deleteButton = shallow(keyActions.children[BUTTON_INDEXES.DELETE_DATA].content())

    await deleteButton.props().onClick()
    expect(notifyError).toHaveBeenNthCalledWith(1, localize(Localization.FALLBACK_INFO))
  })
})
