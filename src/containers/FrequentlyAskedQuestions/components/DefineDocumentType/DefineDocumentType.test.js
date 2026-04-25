
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { DefineDocumentType } from './DefineDocumentType'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: DefineDocumentType', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DefineDocumentType />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
