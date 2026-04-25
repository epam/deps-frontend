
import { mockReact } from '@/mocks/mockReact'
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { updateDocumentsType } from '@/actions/documentsListPage'
import { documentsApi } from '@/api/documentsApi'
import { FORBIDDEN_EXTENSIONS_TO_EXTRACT_DATA, FORBIDDEN_STATES_TO_CHANGE_DOCUMENT_TYPE } from '@/constants/document'
import { ContainerType } from '@/enums/ContainerType'
import { DocumentState } from '@/enums/DocumentState'
import { Localization, localize } from '@/localization/i18n'
import { Document, File } from '@/models/Document'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { PreviewEntity } from '@/models/PreviewEntity'
import { ENV } from '@/utils/env'
import { MoreOptionsCommandMenu } from './MoreOptionsCommandMenu'

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/actions/documentsListPage', () => ({
  updateDocumentsType: jest.fn(() => ['mockedDocumentType']),
}))
jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    retryLastStep: jest.fn(),
  },
}))
jest.mock('@/containers/ChangeDocumentTypeButton', () => mockComponent('ChangeDocumentTypeButton'))
jest.mock('@/containers/ExtractData', () => mockComponent('ExtractData'))
jest.mock('@/containers/RetryPreviousStepButton', () => mockComponent('RetryPreviousStepButton'))
jest.mock('@/selectors/documentTypesListPage')
jest.mock('@/utils/notification', () => mockNotification)

const mockedDocumentId = 'mockId'
const mockedDocumentType = 'mockedDocumentType'

describe('Container: MoreOptionsCommandMenu', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    jest.clearAllMocks()

    defaultProps = {
      selectedDocuments: [
        new Document({
          id: mockedDocumentId,
          state: DocumentState.EXCEPTIONAL_QUEUE,
          error: {
            description: 'mockDescription',
            inState: DocumentState.PREPROCESSING,
          },
          documentType: new PreviewEntity('Test', 'test'),
          containerType: ContainerType.CONTAINER,
          title: 'Title',
          files: [new File('documentUrl.png', 'blobName.png')],
        }),
      ],
    }

    wrapper = shallow(<MoreOptionsCommandMenu {...defaultProps} />)
  })

  it('should be rendered correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render menu items correctly', () => {
    wrapper.props().items.forEach(({ content }) => {
      expect(<div>{content()}</div>).toMatchSnapshot()
    })
  })

  it('should call props updateDocumentType in case of updateDocumentType once, with correct arguments', async () => {
    const button = shallow(
      <div>{wrapper.props().items[0].content()}</div>,
    ).childAt(0)

    await button.props().updateDocumentType(mockedDocumentType)

    expect(updateDocumentsType).nthCalledWith(1, mockedDocumentType, [mockedDocumentId])
  })

  it('should call notifySuccess and in case of updateDocumentType if there are some updated documents', async () => {
    const button = shallow(
      <div>{wrapper.props().items[0].content()}</div>,
    ).childAt(0)

    await button.props().updateDocumentType(mockedDocumentType)

    expect(mockNotification.notifySuccess).nthCalledWith(1, 'Document type was assigned for 1 document(s)')
  })

  it('should call notifyWarning and in case of updateDocumentType if there are NO updated documents', async () => {
    updateDocumentsType.mockReturnValueOnce([])
    const button = shallow(
      <div>{wrapper.props().items[0].content()}</div>,
    ).childAt(0)

    await button.props().updateDocumentType(mockedDocumentType)

    expect(mockNotification.notifyWarning).nthCalledWith(
      1,
      'Can\'t assign type to 1 document(s)',
      'because they were updated by another user',
    )
  })

  it('should render disabled ChangeDocumentTypeButton option for documents with state NEW or IDENTIFICATION', async () => {
    Object.values(DocumentState).forEach((state) => {
      defaultProps.selectedDocuments[0].state = state
      wrapper = shallow(<MoreOptionsCommandMenu {...defaultProps} />)

      const button = shallow(
        <div>{wrapper.props().items[0].content()}</div>,
      ).childAt(0)

      if (FORBIDDEN_STATES_TO_CHANGE_DOCUMENT_TYPE.some((s) => s === state)) {
        expect(button.props().disabled).toBe(true)
      } else {
        expect(button.props().disabled).toBe(false)
      }
    })
  })

  it('should render disabled "Extract Data" option for documents with state PREPROCESSING ', () => {
    defaultProps.selectedDocuments[0].state = DocumentState.PREPROCESSING
    defaultProps.selectedDocuments[0].error = null
    wrapper.setProps(defaultProps)

    const button = shallow(
      <div>{wrapper.props().items[1].content()}</div>,
    ).childAt(0)

    expect(button.props().disabled).toBe(true)
  })

  it('should render disabled "Extract Data" option for documents with state FAILED and error in state PREPROCESSING ', () => {
    const button = shallow(
      <div>{wrapper.props().items[1].content()}</div>,
    ).childAt(0)

    expect(button.props().disabled).toBe(true)
  })

  it('should render disabled "Extract Data" option for documents with documentType "Unknown"', () => {
    defaultProps.selectedDocuments[0].state = DocumentState.COMPLETED
    defaultProps.selectedDocuments[0].error = null
    defaultProps.selectedDocuments[0].documentType = UNKNOWN_DOCUMENT_TYPE
    wrapper.setProps(defaultProps)

    const button = shallow(
      <div>{wrapper.props().items[1].content()}</div>,
    ).childAt(0)

    expect(button.props().disabled).toBe(true)
  })

  it('should render disabled "Extract Data" option for documents in MSG/EML format', () => {
    defaultProps.selectedDocuments[0].state = DocumentState.COMPLETED
    defaultProps.selectedDocuments[0].error = null

    FORBIDDEN_EXTENSIONS_TO_EXTRACT_DATA.forEach((extension) => {
      defaultProps.selectedDocuments[0].files[0].blobName = extension
      wrapper.setProps(defaultProps)

      const button = shallow(
        <div>{wrapper.props().items[1].content()}</div>,
      ).childAt(0)

      expect(button.props().disabled).toBe(true)
    })
  })

  it('should not render "Retry Previous Step" option if flag FEATURE_BULK_RETRY_PREVIOUS_STEP is off', () => {
    ENV.FEATURE_BULK_RETRY_PREVIOUS_STEP = false

    wrapper = shallow(<MoreOptionsCommandMenu {...defaultProps} />)

    wrapper.props().items.forEach(({ content }) => {
      const option = shallow(
        <div>{content()}</div>,
      )

      expect(option.find('RetryPreviousStepButton').exists()).toBe(false)
    })

    ENV.FEATURE_BULK_RETRY_PREVIOUS_STEP = true
  })

  it('should render enabled "Retry Previous Step" option for documents with FAILED state ', () => {
    defaultProps.selectedDocuments[0].state = DocumentState.FAILED
    wrapper = shallow(<MoreOptionsCommandMenu {...defaultProps} />)

    const button = shallow(
      <div>{wrapper.props().items[2].content()}</div>,
    ).childAt(0)

    expect(button.props().disabled).toBe(false)
  })

  it('should call documentsApi.retryLastStep with correct arguments if retryLastStep prop is called', async () => {
    defaultProps.selectedDocuments[0].state = DocumentState.FAILED
    wrapper = shallow(<MoreOptionsCommandMenu {...defaultProps} />)

    const button = shallow(
      <div>{wrapper.props().items[2].content()}</div>,
    ).childAt(0)

    await button.props().retryLastStep(mockedDocumentId)

    expect(documentsApi.retryLastStep).nthCalledWith(1, mockedDocumentId)
  })

  it('should call notifySuccess and in case of retryLastStep success', async () => {
    defaultProps.selectedDocuments[0].state = DocumentState.FAILED
    wrapper = shallow(<MoreOptionsCommandMenu {...defaultProps} />)

    const button = shallow(
      <div>{wrapper.props().items[2].content()}</div>,
    ).childAt(0)

    await button.props().retryLastStep(mockedDocumentId)

    expect(mockNotification.notifySuccess).nthCalledWith(
      1,
      localize(Localization.BULK_RETRY_LAST_STEP_SUCCESS),
    )
  })

  it('should call notifyWarning and in case of retryLastStep failed', async () => {
    const mockReason = 'mockReason'
    documentsApi.retryLastStep.mockImplementationOnce(() => Promise.reject(mockReason))

    defaultProps.selectedDocuments[0].state = DocumentState.FAILED
    wrapper = shallow(<MoreOptionsCommandMenu {...defaultProps} />)

    const button = shallow(
      <div>{wrapper.props().items[2].content()}</div>,
    ).childAt(0)

    await button.props().retryLastStep(mockedDocumentId)

    expect(mockNotification.notifyWarning).nthCalledWith(
      1,
      localize(Localization.DEFAULT_ERROR),
    )
  })

  it('should pass correct confirmation if not all selected documents have FAILED state', () => {
    defaultProps = {
      selectedDocuments: [
        ...defaultProps.selectedDocuments,
        new Document({
          id: 'id2',
          state: DocumentState.FAILED,
          error: {
            description: 'mockDescription',
            inState: DocumentState.PREPROCESSING,
          },
          documentType: new PreviewEntity('Test', 'test'),
          title: 'Title',
        }),
      ],
    }
    wrapper = shallow(<MoreOptionsCommandMenu {...defaultProps} />)

    const button = shallow(
      <div>{wrapper.props().items[2].content()}</div>,
    ).childAt(0)

    expect(button.props().confirmContent).toBe(localize(Localization.BULK_RETRY_LAST_STEP_CONFIRM_CONTENT))
  })
})
