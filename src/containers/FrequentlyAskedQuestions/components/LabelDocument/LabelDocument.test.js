
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { LabelDocument } from './LabelDocument'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: LabelDocument', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<LabelDocument />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
