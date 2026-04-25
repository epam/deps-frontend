
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Button } from './EmptyData.styles'
import { EmptyData } from '.'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: EmptyData', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      onClick: jest.fn(),
    }

    wrapper = shallow(<EmptyData {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call onClick when click on button', () => {
    wrapper.find(Button).props().onClick()

    expect(defaultProps.onClick).toHaveBeenCalled()
  })
})
