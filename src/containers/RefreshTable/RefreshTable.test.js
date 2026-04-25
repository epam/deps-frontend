
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { RefreshTable } from './RefreshTable'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ModelsTableModelCommands', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      refreshTable: jest.fn(),
    }

    wrapper = shallow(<RefreshTable {...defaultProps} />)
  })

  it('should render ModelsTableModelCommands with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
