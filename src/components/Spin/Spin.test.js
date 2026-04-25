
import { shallow } from 'enzyme'
import { Spin } from './'

test('Spin renders correctly', () => {
  const component = shallow(<Spin />)
  expect(component).toMatchSnapshot()
})
