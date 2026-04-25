
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import { clearDocumentStore } from '@/actions/documentReviewPage'
import { fetchDocumentData } from '@/actions/documents'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { setUi, goTo } from '@/actions/navigation'
import { UiKeys } from '@/constants/navigation'
import { ContainerType } from '@/enums/ContainerType'
import { StatusCode } from '@/enums/StatusCode'
import { EmailReviewPage } from '@/pages/EmailReviewPage'
import { documentSelector } from '@/selectors/documentReviewPage'
import { uiSelector } from '@/selectors/navigation'
import { navigationMap } from '@/utils/navigationMap'
import { DocumentReviewPage } from '.'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/actions/documents', () => ({
  fetchDocumentData: jest.fn(),
}))

jest.mock('@/actions/documentTypes', () => ({
  fetchDocumentTypes: jest.fn(),
}))

jest.mock('@/actions/documentNavigationInfo', () => ({
  clearDocumentNavigationInfo: jest.fn(),
  initializeDocumentNavigationInfo: jest.fn(),
}))

jest.mock('@/actions/documentReviewPage', () => ({
  clearDocumentStore: jest.fn(),
}))

jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(),
  setUi: jest.fn(),
}))

jest.mock('@/pages/DocumentReview', () => mockComponent('DocumentReview'))
jest.mock('@/pages/EmailReviewPage', () => mockComponent('EmailReviewPage'))

jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/requests')
jest.mock('@/selectors/router')
jest.mock('@/selectors/navigation')

const {
  mapStateToProps,
  mapDispatchToProps,
  ConnectedComponent,
} = DocumentReviewPage

class ResponseError extends Error {
  constructor (response) {
    super()
    this.response = response
  }
}

describe('Component: documentRoot', () => {
  describe('react component', () => {
    let defaultProps, wrapper

    beforeEach(() => {
      defaultProps = {
        match: {
          params: {
            documentId: '1',
          },
        },
        document: {
          previewDocuments: {
            1: {
              url: 'mock1.png',
              blobName: 'mock1.png',
            },
          },
          processingDocuments: {
            1: {
              url: 'mock1.png',
              blobName: 'mock1.png',
            },
          },
        },
        activePage: 1,
        setUi: jest.fn(),
        goTo: jest.fn(),
        clearDocumentStore: jest.fn(),
        highlightedFieldPk: '',
        fetchDocumentData: jest.fn(),
        fetchDocumentTypes: jest.fn(),
        fetching: false,
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout according to props', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should call to fetchDocumentData after mounting with documentId', () => {
      expect(defaultProps.fetchDocumentData).toHaveBeenCalledWith(defaultProps.match.params.documentId)
    })

    it('should call to fetchDocumentTypes after mounting', () => {
      expect(defaultProps.fetchDocumentTypes).toHaveBeenCalled()
    })

    it('should call goTo with correct url in case fetchDocumentData throw not found error', async () => {
      defaultProps.fetchDocumentData = jest.fn(() => Promise.reject(
        new ResponseError({ status: StatusCode.NOT_FOUND })),
      )
      shallow(<ConnectedComponent {...defaultProps} />)
      await flushPromises()
      expect(defaultProps.goTo).toHaveBeenCalledWith(navigationMap.error.notFound())
    })

    it('should call goTo with correct url in case fetchDocumentData throw forbidden error', async () => {
      defaultProps.fetchDocumentData = jest.fn(() => Promise.reject(
        new ResponseError({ status: StatusCode.FORBIDDEN })),
      )
      shallow(<ConnectedComponent {...defaultProps} />)
      await flushPromises()
      expect(defaultProps.goTo).toHaveBeenCalledWith(navigationMap.error.permissionDenied())
    })

    it('should not call goTo in case fetchDocumentData throw error and no redirect required', async () => {
      defaultProps.fetchDocumentData = jest.fn(() => Promise.reject(new Error()))
      shallow(<ConnectedComponent {...defaultProps} />)
      await flushPromises()
      expect(defaultProps.goTo).not.toHaveBeenCalled()
    })

    it('should render EmailReviewPage if document is container type EMAIL', () => {
      defaultProps.document.containerType = ContainerType.EMAIL

      const wrapper = shallow(<ConnectedComponent {...defaultProps} />)
      expect(wrapper.find(EmailReviewPage).exists()).toEqual(true)
    })
  })

  describe('mapStateToProps', () => {
    const mockState = 'mockState'

    it('should pass active page correctly from the state', () => {
      const { props } = mapStateToProps(mockState)

      expect(props.activePage).toEqual(uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_PAGE])
    })

    it('should pass document prop correctly from the state', () => {
      const { props } = mapStateToProps(mockState)
      expect(props.document).toEqual(documentSelector.getSelectorMockValue())
    })
  })

  describe('mapDispatchToProps', () => {
    it('should pass fetchDocumentData action as a prop', () => {
      const { props } = mapDispatchToProps()

      props.fetchDocumentData()

      expect(fetchDocumentData).toHaveBeenCalled()
    })

    it('should pass fetchDocumentTypes action as a prop', () => {
      const { props } = mapDispatchToProps()

      props.fetchDocumentTypes()

      expect(fetchDocumentTypes).toHaveBeenCalled()
    })

    it('should pass clearDocumentStore action as a prop', () => {
      const { props } = mapDispatchToProps()

      props.clearDocumentStore()

      expect(clearDocumentStore).toHaveBeenCalled()
    })

    it('should pass changeActivePage action as a prop', () => {
      const { props } = mapDispatchToProps()

      props.setUi()

      expect(setUi).toHaveBeenCalled()
    })

    it('should pass goTo action as a prop', () => {
      const { props } = mapDispatchToProps()
      props.goTo()
      expect(goTo).toHaveBeenCalled()
    })
  })
})
