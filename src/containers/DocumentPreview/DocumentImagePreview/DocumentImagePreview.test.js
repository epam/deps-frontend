
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import { ImageViewer } from '@/components/ImageViewer'
import { documentSelector } from '@/selectors/documentReviewPage'
import { FileCache } from '@/services/FileCache'
import { DocumentImagePreview } from './DocumentImagePreview'

let mockCachedRef = null

jest.mock('react', () => mockReact({
  mockUseRef: jest.fn(() => {
    if (!mockCachedRef) {
      mockCachedRef = { current: false }
    }
    return mockCachedRef
  }),
}))
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/services/FileCache', () => ({
  FileCache: {
    requestAndStore: jest.fn(() => Promise.resolve({})),
  },
}))

describe('Container: DocumentImagePreview', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    jest.clearAllMocks()
    mockCachedRef = null
    FileCache.requestAndStore.mockClear()
    defaultProps = {
      activePage: 2,
      document: documentSelector.getSelectorMockValue(),
      highlightedField: [],
      onAddActivePolygons: jest.fn(),
      onClearActivePolygons: jest.fn(),
      renderPageSwitcher: jest.fn(),
    }
    wrapper = shallow(<DocumentImagePreview {...defaultProps} />)
  })

  it('should render correct layout', async () => {
    defaultProps = {
      ...defaultProps,
      activeSourceId: 'dadasdqe',
    }
    wrapper = shallow(<DocumentImagePreview {...defaultProps} />)
    await flushPromises()
    expect(wrapper).toMatchSnapshot()
  })

  it('should pass correct imageURL prop in case activeSourceId is not passed', () => {
    const blobNameMock = documentSelector.getSelectorMockValue().unifiedData[2][0].blobName
    const expectedResult = `http://mockUrl.com/v5/file/${blobNameMock}`
    expect(wrapper.find(ImageViewer).props().imageUrl).toEqual(expectedResult)
  })

  it('should skip caching when FEATURE_FILE_CACHE is disabled and images already cached', async () => {
    mockCachedRef = null
    FileCache.requestAndStore.mockClear()

    const testWrapper = shallow(<DocumentImagePreview {...defaultProps} />)
    await flushPromises()

    expect(FileCache.requestAndStore).toHaveBeenCalled()

    FileCache.requestAndStore.mockClear()

    testWrapper.setProps({ activePage: 1 })
    await flushPromises()

    expect(FileCache.requestAndStore).not.toHaveBeenCalled()
  })

  it('should cache images when FEATURE_FILE_CACHE is enabled even if already cached', async () => {
    mockEnv.ENV.FEATURE_FILE_CACHE = true
    FileCache.requestAndStore.mockClear()

    wrapper = shallow(<DocumentImagePreview {...defaultProps} />)
    await flushPromises()

    expect(FileCache.requestAndStore).toHaveBeenCalled()

    FileCache.requestAndStore.mockClear()

    wrapper.setProps({ activePage: 1 })

    expect(FileCache.requestAndStore).toHaveBeenCalled()

    mockEnv.ENV.FEATURE_FILE_CACHE = false
  })
})
