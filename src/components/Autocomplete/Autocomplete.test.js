
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { SelectOption } from '@/components/Select'
import { Autocomplete } from '.'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: Autocomplete', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      notFoundContent: 'not Found Content mock',
      onChange: jest.fn(),
      onFocus: jest.fn(),
      options: [new SelectOption('test', 'test')],
      value: 'test',
      disabled: false,
    }

    wrapper = shallow(<Autocomplete {...defaultProps} />)
  })

  it('should render correct layout according to props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should be rendered with the correct disabled value', () => {
    wrapper.setProps({
      ...defaultProps,
      disabled: true,
    })

    expect(wrapper.props().disabled).toEqual(true)
  })
})
