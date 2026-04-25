
import { shallow } from 'enzyme'
import { TypographyText } from './TypographyText'
import { StyledText } from './TypographyText.styles'

describe('Component: TypographyText', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      content: 'Mock_DocumentName',
      editable: {
        onChange: jest.fn(),
        enterIcon: <div>Icon</div>,
      },
    }

    wrapper = shallow(<TypographyText {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call editable.onChange in case calling to onChange', () => {
    const textArea = wrapper.find(StyledText)

    textArea.props().editable.onChange()
    expect(defaultProps.editable.onChange).toHaveBeenCalled()
  })
})
