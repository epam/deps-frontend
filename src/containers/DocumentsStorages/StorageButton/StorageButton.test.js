
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { StorageButton } from './StorageButton'
import { TextButton } from './StorageButton.styles'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: StorageButton', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      isActive: false,
      onClick: jest.fn(),
      storageName: 'name',
      icon: <span />,
      disabled: false,
      title: 'Test title',
    }

    wrapper = shallow(<StorageButton {...defaultProps} />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render TextButton if StorageButton is active', () => {
    defaultProps.isActive = true

    wrapper = shallow(<StorageButton {...defaultProps} />)

    expect(wrapper.find(TextButton).exists()).toBe(true)
  })
})
