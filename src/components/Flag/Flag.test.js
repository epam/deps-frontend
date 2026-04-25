
import { shallow } from 'enzyme'
import { Flag } from '@/components/Flag'
import { Placement } from '@/enums/Placement'

describe('Component: Flag', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      symbol: 'A',
      title: 'A symbol title',
      type: 'info',
      tooltipPlacement: Placement.TOP,
    }

    wrapper = shallow(<Flag {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
