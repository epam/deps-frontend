
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { DetectModalButton } from './DetectModalButton'

jest.mock('@/selectors/navigation')
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/requests')
jest.mock('@/utils/env', () => mockEnv)

describe('Component: DetectModalButton', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      title: 'Test',
      disabled: false,
      onOk: jest.fn(),
      className: 'testClassName',
      message: 'test',
    }
    wrapper = shallow(<DetectModalButton {...defaultProps} />)
  })

  it('should correct render default state button', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should correct render button with tablePicker', () => {
    wrapper.setState({ visible: true })

    expect(wrapper).toMatchSnapshot()
  })
})
