
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { ExportData } from './ExportData'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ExportData', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ExportData />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
