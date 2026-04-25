
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { useLocation } from 'react-router-dom'
import { customizationSelector } from '@/selectors/customization'
import { UserFeedback } from './UserFeedback'
import { Wrapper } from './UserFeedback.styles'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/customization')
jest.mock('@/selectors/authorization')

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({
    pathname: '/documents',
  })),
}))

describe('Component: UserFeedback', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<UserFeedback />)
  })

  it('should render layout correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render nothing in case there is no UserFeedback in customization', () => {
    customizationSelector.mockImplementationOnce(() => ({}))
    wrapper = shallow(<UserFeedback />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should hide UserFeedback button for not storage pages', () => {
    jest.clearAllMocks()
    useLocation.mockImplementationOnce(jest.fn(() => ({
      pathname: '/mock',
    })))
    wrapper = shallow(<UserFeedback />)
    expect(wrapper.find(Wrapper).props().isVisible).toBe(false)
  })
})
