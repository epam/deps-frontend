
import { shallow } from 'enzyme'
import { Ellipsis } from '.'

const ellipsisContent = 'ellipsisContent'

describe('Component: Ellipsis', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      rows: 2,
      tooltip: true,
    }

    wrapper = shallow(
      <Ellipsis {...defaultProps}>
        {ellipsisContent}
      </Ellipsis>,
    )
  })

  it('should be rendered correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
