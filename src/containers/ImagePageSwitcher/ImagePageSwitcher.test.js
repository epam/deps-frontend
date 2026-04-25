
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { ImagePageSwitcher } from './ImagePageSwitcher'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/utils/env', () => mockEnv)

describe('Container: ImagePageSwitcher', () => {
  it('should render correct layout', () => {
    const defaultProps = {
      className: 'HiMan',
      pagesQuantity: 3,
      activePage: 1,
      disabled: false,
      onChangeActivePage: jest.fn(),
    }

    const wrapper = shallow(<ImagePageSwitcher {...defaultProps} />)

    expect(wrapper).toMatchSnapshot()
  })
})
