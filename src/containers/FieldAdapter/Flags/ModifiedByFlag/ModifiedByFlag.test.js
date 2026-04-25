
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Flag } from '@/components/Flag'
import { ModifiedByFlag } from './ModifiedByFlag'

jest.mock('@/utils/env', () => mockEnv)

describe('Container: ModifiedByFlag', () => {
  let defaultProps, wrapper

  it('should render correct layout', () => {
    defaultProps = {
      modifiedBy: 'modifiedByMock',
    }
    wrapper = shallow(<ModifiedByFlag {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should nor render ModifiedByFlag in case modifiedBy property is empty', () => {
    defaultProps = {}
    wrapper = shallow(<ModifiedByFlag {...defaultProps} />)
    expect(wrapper.find(Flag).exists()).toBe(false)
  })
})
