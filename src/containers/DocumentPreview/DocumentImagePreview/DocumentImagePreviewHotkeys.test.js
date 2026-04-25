
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { highlightPolygonCoordsField } from '@/actions/documentReviewPage'
import { UiKeys } from '@/constants/navigation'
import { documentSelector } from '@/selectors/documentReviewPage'
import { uiSelector } from '@/selectors/navigation'
import { DocumentImagePreviewHotkeys } from './DocumentImagePreviewHotkeys'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/documentReviewPage', () => ({
  highlightPolygonCoordsField: jest.fn(),
}))

jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/navigation')
jest.mock('@/utils/env', () => mockEnv)

const {
  mapStateToProps,
  mapDispatchToProps,
  ConnectedComponent,
} = DocumentImagePreviewHotkeys

describe('Container: DocumentImagePreviewHotkeys', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      activePage: uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_PAGE],
      document: documentSelector.getSelectorMockValue(),
      highlightPolygonCoordsField: jest.fn(),
    }

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
  })

  it('should render correct layout according to props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  describe('mapStateToProps', () => {
    it('should call uiSelector and pass the result as activePage prop', () => {
      const { props } = mapStateToProps()

      expect(uiSelector).toHaveBeenCalled()
      expect(props.activePage).toEqual(uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_PAGE])
    })
  })

  describe('mapDispatchToProps', () => {
    it('should pass highlightPolygonCoordsField action as highlightPolygonCoordsField property', () => {
      const { props } = mapDispatchToProps()

      props.highlightPolygonCoordsField()
      expect(highlightPolygonCoordsField).toHaveBeenCalledTimes(1)
    })
  })
})
