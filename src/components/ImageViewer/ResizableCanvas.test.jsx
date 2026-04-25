
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { ResizableCanvas } from './ResizableCanvas'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ResizableCanvas', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      imageUrl: 'http://sample.jpeg',
    }

    wrapper = shallow(<ResizableCanvas {...defaultProps} />).dive()
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
