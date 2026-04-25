
import { shallow } from 'enzyme'
import { ButtonIcon } from './FieldControls.styles'
import { FieldControls } from './'

describe('Component: FieldControls', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      disabled: false,
      onDelete: jest.fn(),
    }

    wrapper = shallow(<FieldControls {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call onDelete prop when click on the DeleteButton', () => {
    wrapper.find(ButtonIcon).props().onClick()

    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1)
  })
})
