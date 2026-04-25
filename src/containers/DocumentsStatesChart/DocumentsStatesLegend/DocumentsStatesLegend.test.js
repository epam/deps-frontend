
import { shallow } from 'enzyme'
import { DocumentsStatesLegend } from './DocumentsStatesLegend'

describe('Component: DocumentsStatesLegend', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      config: [{
        id: 'test',
        value: 123,
        color: 'red',
      }],
    }

    wrapper = shallow(<DocumentsStatesLegend {...defaultProps} />)
  })

  it('should render correct layout with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
