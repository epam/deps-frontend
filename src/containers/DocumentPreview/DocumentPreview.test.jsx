
import { mockReact } from '@/mocks/mockReact'
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { usePolling } from 'use-raf-polling'
import { getDocumentState } from '@/actions/documentReviewPage'
import { documentsApi } from '@/api/documentsApi'
import { Spin } from '@/components/Spin'
import { UiKeys } from '@/constants/navigation'
import { DocumentState } from '@/enums/DocumentState'
import { FileExtension } from '@/enums/FileExtension'
import { ResponseType } from '@/enums/ResponseType'
import { KnownBusinessEvent } from '@/hooks/useEventSource'
import { File } from '@/models/Document'
import { documentSelector, highlightedFieldSelector } from '@/selectors/documentReviewPage'
import { uiSelector } from '@/selectors/navigation'
import { ENV } from '@/utils/env'
import { DocumentDocxViewer } from './DocumentDocxViewer'
import { DocumentImageBasedViewer } from './DocumentImageBasedViewer'
import { DocumentPreview } from './DocumentPreview'
import { DocumentTableViewer } from './DocumentTableViewer'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('react', () => mockReact())
jest.mock('./DocumentImageBasedViewer', () => mockComponent('DocumentImageBasedViewer'))
jest.mock('./DocumentDocxViewer', () => mockComponent('DocumentDocxViewer'))
jest.mock('./DocumentTableViewer', () => mockComponent('DocumentTableViewer'))
jest.mock('./DocumentImagePageSwitcher', () => mockComponent('DocumentImagePageSwitcher'))
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/navigation')
jest.mock('@/utils/env', () => mockEnv)
jest.mock('use-raf-polling', () => ({ usePolling: jest.fn() }))
jest.mock('@/selectors/requests', () => ({
  isDocumentStateGettingSelector: jest.fn(),
}))

let mockGetUD
let mockPollGetDocumentState
let mockAddEvent
let mockOnDocumentStateChanged

jest.mock('@/actions/documentReviewPage', () => ({
  getDocumentState: jest.fn(),
}))

jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    getUnifiedData: jest.fn(),
  },
}))

jest.mock('@/hooks/useEventSource', () => ({
  useEventSource: jest.fn(() => jest.fn()),
  KnownBusinessEvent: {
    DOCUMENT_STATE_UPDATED: 'DOCUMENT_STATE_UPDATED',
  },
}))

React.useCallback
  .mockImplementationOnce((fn) => {
    mockPollGetDocumentState = fn
    return fn
  })
  .mockImplementationOnce((fn) => {
    mockGetUD = fn
    return fn
  })

jest.mock('@/hooks/useEventSource', () => ({
  useEventSource: jest.fn(() => {
    mockAddEvent = jest.fn((eventName, callback) => {
      mockOnDocumentStateChanged = callback
    })
    return mockAddEvent
  }),
  KnownBusinessEvent: {
    DOCUMENT_STATE_UPDATED: 'DocumentStateUpdated',
  },
}))

describe('Container: DocumentPreview', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()

    defaultProps = {
      addActivePolygons: jest.fn(),
      clearActivePolygons: jest.fn(),
      fetching: false,
      onChangeActiveImagePage: jest.fn(() => {}),
      onChangeActiveExcelPage: jest.fn(() => {}),
      document: documentSelector.getSelectorMockValue(),
      onRefreshPage: jest.fn(() => {}),
      activeSourceId: uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_SOURCE_ID],
      activePage: 1,
      highlightedField: highlightedFieldSelector.getSelectorMockValue(),
    }
    wrapper = shallow(<DocumentPreview {...defaultProps} />)
  })

  it('should call usePolling with expected config if FEATURE_SERVER_SENT_EVENTS is off and document should be polled', () => {
    ENV.FEATURE_SERVER_SENT_EVENTS = false

    expect(usePolling).nthCalledWith(1, {
      callback: mockPollGetDocumentState,
      interval: 2000,
      condition: false,
      onPollingSucceed: mockGetUD,
    })

    ENV.FEATURE_SERVER_SENT_EVENTS = true
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Spin.Centered in case fetching', () => {
    defaultProps.fetching = true
    wrapper.setProps(defaultProps)
    expect(wrapper.find(Spin.Centered).exists()).toBe(true)
  })

  const tableExtensions = [
    FileExtension.XLSX,
    FileExtension.XLS,
    FileExtension.XLSM,
    FileExtension.XLTX,
    FileExtension.XLTM,
    FileExtension.CSV,
  ]

  const imageExtensions = [
    FileExtension.JPG,
    FileExtension.JPEG,
    FileExtension.PNG,
    FileExtension.TIFF,
    FileExtension.TIF,
    FileExtension.PDF,
  ]

  const docxExtensions = [FileExtension.DOCX]

  const unsupportedExtensions = [FileExtension.XML, FileExtension.JSON]

  it.each(tableExtensions)(
    'should render DocumentTableViewer for %s files',
    (extension) => {
      const url = 'url' + extension
      const blobName = ResponseType.BLOB + extension
      defaultProps.document.files[0] = new File(url, blobName)
      wrapper.setProps(defaultProps)
      expect(wrapper.find(DocumentTableViewer).exists()).toBe(true)
      expect(wrapper.find(DocumentImageBasedViewer).exists()).toBe(false)
      expect(wrapper.find(DocumentDocxViewer).exists()).toBe(false)
    },
  )

  it.each(imageExtensions)(
    'should render DocumentImageBasedViewer for %s files',
    (extension) => {
      const url = 'url' + extension
      const blobName = ResponseType.BLOB + extension
      defaultProps.document.files[0] = new File(url, blobName)
      wrapper.setProps(defaultProps)
      expect(wrapper.find(DocumentImageBasedViewer).exists()).toBe(true)
      expect(wrapper.find(DocumentTableViewer).exists()).toBe(false)
      expect(wrapper.find(DocumentDocxViewer).exists()).toBe(false)
    },
  )

  it.each(docxExtensions)(
    'should render DocumentDocxViewer for %s files',
    (extension) => {
      const url = 'url' + extension
      const blobName = ResponseType.BLOB + extension
      defaultProps.document.files[0] = new File(url, blobName)
      wrapper.setProps(defaultProps)
      expect(wrapper.find(DocumentDocxViewer).exists()).toBe(true)
      expect(wrapper.find(DocumentImageBasedViewer).exists()).toBe(false)
      expect(wrapper.find(DocumentTableViewer).exists()).toBe(false)
    },
  )

  it.each(unsupportedExtensions)(
    'should not render any viewer for unsupported %s files',
    (extension) => {
      const url = 'url' + extension
      const blobName = ResponseType.BLOB + extension
      defaultProps.document.files[0] = new File(url, blobName)
      wrapper.setProps(defaultProps)
      expect(wrapper.find(DocumentImageBasedViewer).exists()).toBe(false)
      expect(wrapper.find(DocumentTableViewer).exists()).toBe(false)
      expect(wrapper.find(DocumentDocxViewer).exists()).toBe(false)
    },
  )

  it('should render Empty with correct description in case unsupported extension', () => {
    const url = `mock/image${FileExtension.XML}`
    const blobName = `blob${FileExtension.XML}`
    defaultProps.document.files[0] = new File(url, blobName)
    wrapper.setProps(defaultProps)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Empty with correct description in case document does not have data to preview and no unified data', () => {
    defaultProps.document = {
      ...defaultProps.document,
      unifiedData: undefined,
      previewDocuments: {},
    }
    wrapper.setProps(defaultProps)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Empty with correct description in case document does not have data to preview and no unified data', () => {
    defaultProps.document = {
      ...defaultProps.document,
      unifiedData: undefined,
      previewDocuments: {
        ...defaultProps.document.previewDocuments,
        1: null,
      },
    }
    wrapper.setProps(defaultProps)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Empty with correct description in case document in failed state and no unified data and preview documents', () => {
    defaultProps.document = {
      ...defaultProps.document,
      state: DocumentState.FAILED,
      unifiedData: undefined,
      previewDocuments: {
        ...defaultProps.document.previewDocuments,
        1: null,
      },
    }
    wrapper.setProps(defaultProps)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Empty with correct description in case document in failed state', () => {
    defaultProps.document = {
      ...defaultProps.document,
      state: DocumentState.FAILED,
      unifiedData: null,
      previewDocuments: {},
    }
    wrapper.setProps(defaultProps)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Empty with correct description and refresh page link in case of document in preprocessing state', () => {
    defaultProps.document.state = DocumentState.PREPROCESSING
    wrapper.setProps(defaultProps)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Empty with correct description and refresh page link in case of document in new state', () => {
    defaultProps.document.state = DocumentState.NEW
    wrapper.setProps(defaultProps)
    expect(wrapper).toMatchSnapshot()
  })

  it('should call props.fetchDocumentData when clicked on refresh the page', () => {
    defaultProps.document.state = DocumentState.PREPROCESSING
    wrapper.setProps(defaultProps)
    wrapper.find('a').props().onClick()
    expect(defaultProps.onRefreshPage).toHaveBeenCalled()
  })

  describe('SSE event handling', () => {
    beforeEach(() => {
      ENV.FEATURE_SERVER_SENT_EVENTS = true

      defaultProps.document = {
        ...documentSelector.getSelectorMockValue(),
        _id: 'test-document-id',
        state: DocumentState.PREPROCESSING,
        unifiedData: null,
      }
    })

    it('should call addEvent from useEventSource with correct arguments when SSE is enabled', () => {
      shallow(<DocumentPreview {...defaultProps} />)

      expect(mockAddEvent).toHaveBeenCalledWith(
        KnownBusinessEvent.DOCUMENT_STATE_UPDATED,
        expect.any(Function),
      )
    })

    it('should call getDocumentState when document state changes and document is not ready to view', async () => {
      shallow(<DocumentPreview {...defaultProps} />)

      const eventData = {
        documentId: 'test-document-id',
        state: DocumentState.UNIFICATION,
      }

      await mockOnDocumentStateChanged(eventData)

      expect(getDocumentState).toHaveBeenCalled()
    })

    it('should not call getDocumentState when document state changes and document is ready to view', async () => {
      defaultProps.document = {
        ...documentSelector.getSelectorMockValue(),
        _id: 'test-document-id',
        state: DocumentState.NEEDS_REVIEW,
      }

      shallow(<DocumentPreview {...defaultProps} />)

      const eventData = {
        documentId: 'test-document-id',
        state: DocumentState.IN_REVIEW,
      }

      await mockOnDocumentStateChanged(eventData)

      expect(getDocumentState).not.toHaveBeenCalled()
    })

    it('should call documentsApi.getUnifiedData when document state changes and document is ready to view and does not have unified data yet', async () => {
      shallow(<DocumentPreview {...defaultProps} />)

      const eventData = {
        documentId: 'test-document-id',
        state: DocumentState.IMAGE_PREPROCESSING,
      }

      await mockOnDocumentStateChanged(eventData)

      expect(documentsApi.getUnifiedData).nthCalledWith(1, defaultProps.document._id)
    })

    it('should not call documentsApi.getUnifiedData when document state changes and document is not ready to view', async () => {
      shallow(<DocumentPreview {...defaultProps} />)

      const eventData = {
        documentId: 'test-document-id',
        state: DocumentState.UNIFICATION,
      }

      await mockOnDocumentStateChanged(eventData)

      expect(documentsApi.getUnifiedData).not.toHaveBeenCalled()
    })

    it('should not call documentsApi.getUnifiedData when document state changes and document is ready to view and has unified data', async () => {
      defaultProps.document = {
        ...documentSelector.getSelectorMockValue(),
        _id: 'test-document-id',
        state: DocumentState.NEEDS_REVIEW,
      }

      shallow(<DocumentPreview {...defaultProps} />)

      const eventData = {
        documentId: 'test-document-id',
        state: DocumentState.IN_REVIEW,
      }

      await mockOnDocumentStateChanged(eventData)

      expect(documentsApi.getUnifiedData).not.toHaveBeenCalled()
    })
  })
})
