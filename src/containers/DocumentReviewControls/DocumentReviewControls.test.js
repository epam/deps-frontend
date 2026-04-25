
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { startReview } from '@/actions/documentReviewPage'
import {
  ALLOW_TO_START_REVIEW_STATES,
  FORBIDDEN_EXTENSIONS_TO_START_REVIEW,
} from '@/constants/document'
import { ValidationResults } from '@/containers/ValidationResults'
import { DocumentState } from '@/enums/DocumentState'
import { localize, Localization } from '@/localization/i18n'
import { Document } from '@/models/Document'
import * as documentSelectors from '@/selectors/documentReviewPage'
import {
  isDocumentDataFetchingSelector,
  isReviewCompletingSelector,
  isReviewStartingSelector,
  isPipelineRunningSelector,
  isDocumentTypeUpdatingSelector,
} from '@/selectors/requests'
import { ConnectedComponent as DocumentReviewControls } from './DocumentReviewControls'

jest.mock('@/components/LabelingTool', () => ({
  isLabelingToolAvailable: jest.fn(() => true),
  LabelingTool: mockComponent('LabelingTool'),
}))

jest.mock('react-redux', () => mockReactRedux)

jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/requests')

const mockDocumentActions = {
  startReview: 'mockStartReview',
}

jest.mock('@/actions/documentReviewPage', () => ({
  startReview: jest.fn(() => mockDocumentActions.startReview),
}))

jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/utils/env', () => mockEnv)

const mockData = [
  new Document({ id: 'mockDocumentId' }),
]

const mockErrorMessage = 'Mock Error Message'
const mockError = new Error(mockErrorMessage)

jest.mock('@/containers/CompleteReviewButton', () => mockComponent('CompleteReviewButton'))
jest.mock('@/containers/MoreActions', () => mockComponent('MoreActions'))
jest.mock('@/containers/ValidationResults', () => mockComponent('ValidationResults'))

const { ConnectedComponent } = DocumentReviewControls
const startReviewButtonId = '#startReview'

describe('Container: DocumentReviewControls', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      startReview: jest.fn(() => Promise.resolve(mockData)),
      document: documentSelectors.documentSelector.getSelectorMockValue(),
      documentType: documentSelectors.documentTypeSelector.getSelectorMockValue(),
      fetching: false,
    }

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    jest.clearAllMocks()
  })

  it('should render document view controls component with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render ValidationResults in case there is no such field in documentType', () => {
    defaultProps.documentType = {
      ...defaultProps.documentType,
      fields: [],
    }

    wrapper.setProps(defaultProps)

    expect(wrapper.find(ValidationResults).exists()).toBe(false)
  })

  it('should not render "Start Review" button for files with MSG/EML extensions', () => {
    defaultProps.document = {
      ...documentSelectors.documentSelector.getSelectorMockValue(),
      state: DocumentState.COMPLETED,
    }
    defaultProps.document.documentType.code = 'mockTypeCode'

    FORBIDDEN_EXTENSIONS_TO_START_REVIEW.forEach((extension) => {
      defaultProps.document.files[0].blobName = `mockName${extension}`
      wrapper.setProps(defaultProps)
      expect(wrapper.find(startReviewButtonId).isEmptyRender()).toEqual(true)
    })
  })

  it('should not render "Start Review" button if document state is not in the allowed list', () => {
    const forbiddenStates = Object.values(DocumentState)
      .filter((val) => !ALLOW_TO_START_REVIEW_STATES.includes(val))
    forbiddenStates.forEach((state) => {
      defaultProps.document = {
        ...documentSelectors.documentSelector.getSelectorMockValue(),
        state,
      }
      wrapper.setProps(defaultProps)
      expect(wrapper.find(startReviewButtonId).isEmptyRender()).toEqual(true)
    })
  })

  it('should render "Start Review" button if document state is in the allowed list', () => {
    ALLOW_TO_START_REVIEW_STATES.forEach((state) => {
      defaultProps.document = {
        ...documentSelectors.documentSelector.getSelectorMockValue(),
        state,
      }
      wrapper.setProps(defaultProps)
      expect(wrapper.find(startReviewButtonId)).toBeDefined()
    })
  })

  it('should call props startReview when calling to startReview', async () => {
    await wrapper.instance().startReview()
    expect(defaultProps.startReview).nthCalledWith(1)
  })

  it('should call notifyRequest in case of startReview ', async () => {
    await wrapper.instance().startReview()
    expect(mockNotification.notifyProgress).nthCalledWith(1, localize(Localization.FETCHING_START_REVIEW_DOCUMENT))
  })

  it('should call success in case of startReview ', async () => {
    await wrapper.instance().startReview()
    expect(mockNotification.notifySuccess).nthCalledWith(1, localize(Localization.START_REVIEW_SUCCESSFUL))
  })

  it('should call warning in case of startReview rejection', async () => {
    defaultProps.startReview.mockImplementationOnce(() => Promise.reject(mockError))
    try {
      await wrapper.instance().startReview()
      expect(mockNotification.notifyWarning).nthCalledWith(1, localize(Localization.START_REVIEW_FAILED))
    } catch (err) {
      expect(err.message).toBe(mockErrorMessage)
    }
  })
})

describe('Container: DocumentReviewControls', () => {
  describe('mapStateToProps', () => {
    const mapStateToProps = DocumentReviewControls.mapStateToProps
    const mockState = 'mockState'
    let props

    beforeEach(() => {
      props = mapStateToProps(mockState).props
    })

    it('should map document property from document state', () => {
      expect(documentSelectors.documentSelector).toHaveBeenCalled()
      expect(props.document).toEqual(documentSelectors.documentSelector.getSelectorMockValue())
    })

    it('should map documentType property from document state', () => {
      expect(documentSelectors.documentTypeSelector).toHaveBeenCalled()
      expect(props.documentType).toEqual(documentSelectors.documentTypeSelector.getSelectorMockValue())
    })

    it('should calling fetching selectors', () => {
      expect(isDocumentDataFetchingSelector).toHaveBeenCalled()
      expect(isReviewCompletingSelector).toHaveBeenCalled()
      expect(isReviewStartingSelector).toHaveBeenCalled()
      expect(isDocumentTypeUpdatingSelector).toHaveBeenCalled()
      expect(isPipelineRunningSelector).toHaveBeenCalled()
    })
  })

  describe('mergeProps', () => {
    const mergeProps = DocumentReviewControls.mergeProps
    const mockMapDispatch = { dispatch: jest.fn() }
    const mockStateProps = {
      document: documentSelectors.documentSelector.getSelectorMockValue(),
      documentType: documentSelectors.documentTypeSelector,
      fetching: false,
    }

    let props, dispatch

    beforeEach(() => {
      const mergedProps = mergeProps(mockStateProps, mockMapDispatch)
      props = mergedProps.props
      dispatch = mergedProps.dispatch
    })

    it('should dispatch startReview when calling to startReview with correct parameters', () => {
      props.startReview()
      expect(startReview).toHaveBeenCalledTimes(1)
      expect(startReview).toHaveBeenCalledWith(mockStateProps.document._id)
      expect(dispatch).toHaveBeenCalledWith(mockDocumentActions.startReview)
    })
  })
})
