
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { UiKeys } from '@/constants/navigation'
import { uiSelector } from '@/selectors/navigation'
import { GoToErrorButton } from './GoToErrorButton'

const mockError = 'mockError'

jest.mock('@/actions/documentReviewPage', () => ({
  goToError: jest.fn(() => mockError),
}))

jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/navigation')

jest.mock('react-redux', () => mockReactRedux)

const { ConnectedComponent } = GoToErrorButton

describe('Component: GoToErrorButton', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      errorsPages: [],
      goToError: jest.fn(),
      children: 'Go To Error',
    }

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
  })

  it('should render GoToErrorButton with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })
})

describe('Container: GoToErrorButton', () => {
  describe('mapStateToProps', () => {
    const mapStateToProps = GoToErrorButton.mapStateToProps
    const mockState = 'mockState'
    let props

    beforeEach(() => {
      props = mapStateToProps(mockState).props
    })

    it('should map activePage property from document state', () => {
      expect(uiSelector).toHaveBeenCalled()
      expect(props.activePage).toEqual(uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_PAGE])
    })
  })
})
