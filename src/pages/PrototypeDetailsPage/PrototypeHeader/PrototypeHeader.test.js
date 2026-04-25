
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { PageNavigationHeader } from '@/containers/PageNavigationHeader'
import { PrototypeHeader } from './PrototypeHeader'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

describe('Component: PrototypeHeader', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      isEditMode: false,
      isSavingDisabled: false,
      onPrototypeNameChange: jest.fn(),
      onCancel: jest.fn(),
      onEdit: jest.fn(),
      onSave: jest.fn(),
      prototypeName: 'mockName',
      prototypeId: 'mockId',
    }

    wrapper = shallow(<PrototypeHeader {...defaultProps} />)
  })

  it('should render the correct layout with default props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render the correct controls layout if edit mode is not enabled', () => {
    const headerExtra = wrapper.props().renderExtra()
    expect(headerExtra).toMatchSnapshot()
  })

  it('should render the correct controls layout if edit mode is enabled', () => {
    wrapper.setProps({
      ...defaultProps,
      isEditMode: true,
    })
    const headerExtra = shallow(wrapper.find(PageNavigationHeader).props().renderExtra())
    expect(headerExtra).toMatchSnapshot()
  })
})
