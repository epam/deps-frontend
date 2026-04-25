
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { DocumentState } from '@/enums/DocumentState'
import { DocumentStatus } from './DocumentStatus'

jest.mock('@/utils/env', () => mockEnv)

describe('Container: DocumentStatus', () => {
  let defaultProps, wrapper

  it('should render correct layout', () => {
    Object.values(DocumentState).forEach((state) => {
      defaultProps = {
        status: state,
      }
      wrapper = shallow(<DocumentStatus {...defaultProps} />)
      expect(wrapper).toMatchSnapshot()
    })
  })
})
