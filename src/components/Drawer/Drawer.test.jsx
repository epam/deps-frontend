
import { shallow } from 'enzyme'
import { Placement } from '@/enums/Placement'
import { Drawer } from '.'

describe('Component: Drawer', () => {
  let defaultProps, wrapper

  beforeEach(() => {
    defaultProps = {
      title: 'Test Drawer',
      placement: Placement.RIGHT,
      hasCloseIcon: false,
      onClose: jest.fn(),
      open: true,
      width: '40rem',
      getContainer: false,
      destroyOnClose: false,
      children: [
        <div key="command1">Drawer</div>,
      ],
    }

    wrapper = shallow(<Drawer {...defaultProps} />)
  })

  it('should render correct layout based on the props', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
