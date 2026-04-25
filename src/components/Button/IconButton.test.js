
import { shallow } from 'enzyme'
import { Button } from '.'

describe('Component: IconButton', () => {
  it('should render layout correctly according to props', () => {
    const props = {
      icon: (<div>Icon</div>),
      loading: false,
      disabled: false,
    }

    const wrapper = shallow(<Button.Icon {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
