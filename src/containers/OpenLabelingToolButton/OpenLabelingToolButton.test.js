
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { goTo } from '@/utils/routerActions'
import { OpenLabelingToolButton } from '.'

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/notification', () => mockNotification)

describe('Container: OpenLabelingToolButton', () => {
  let defaultProps, wrapper
  beforeEach(() => {
    defaultProps = {
      disabled: false,
      documentId: 'doc_id',
      children: 'children',
    }

    wrapper = shallow(<OpenLabelingToolButton {...defaultProps} />)
  })

  it('should render correct layout based on props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call goTo when calling onClick', () => {
    wrapper.props().onClick()
    expect(goTo).toHaveBeenCalled()
  })
})
