
import { shallow } from 'enzyme'
import { Tag } from './Tag'
import { StyledTag } from './TagsInput.styles'

describe('Component: Tag', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      tag: 'tag',
      onClose: jest.fn(),
    }

    wrapper = shallow(<Tag {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should remove tag when onClose method is called', () => {
    const props = wrapper.find(StyledTag).props()

    props.onClose()

    expect(defaultProps.onClose).toHaveBeenCalledWith(defaultProps.tag)
  })
})
