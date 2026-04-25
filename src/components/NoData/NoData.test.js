
import { shallow } from 'enzyme'
import { NoData } from './NoData'

describe('Component: NoData', () => {
  it('should render correct layout with expected image prop value', () => {
    expect(shallow(<NoData />)).toMatchSnapshot()
  })
})
