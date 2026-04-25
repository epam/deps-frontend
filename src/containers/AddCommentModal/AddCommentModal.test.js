
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Modal } from '@/components/Modal'
import { AddCommentModal } from './'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: AddCommentModal', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      onOk: jest.fn(),
      title: 'Modal title',
      disabled: false,
    }
    wrapper = shallow(<AddCommentModal {...defaultProps} />)
  })

  it('should render AddCommentModal with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call props onOk with correct arg in case calling modal onOk', () => {
    const modalProps = wrapper.find(Modal).props()
    modalProps.onOk()
    expect(defaultProps.onOk).nthCalledWith(1, '')
  })
})
