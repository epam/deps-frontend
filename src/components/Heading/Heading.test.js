
import { shallow } from 'enzyme'
import {
  Heading,
  HeadingLevel,
} from './Heading'

describe('Heading component', () => {
  it('should render correct layout according to props', () => {
    const props = {
      level: HeadingLevel.H2,
    }
    const wrapper = shallow(<Heading {...props}>Text</Heading>)

    expect(wrapper).toMatchSnapshot()
  })
})
