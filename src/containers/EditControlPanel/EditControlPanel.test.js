
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { EditControlPanel } from './EditControlPanel'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: EditControlPanel', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      isSavingDisabled: false,
      onCancel: jest.fn(),
      onSave: jest.fn(),
    }

    wrapper = shallow(<EditControlPanel {...defaultProps} />)
  })

  it('should render the correct layout with default props', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
