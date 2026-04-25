
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { UploadDocument } from './UploadDocument'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: UploadDocument', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<UploadDocument />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
