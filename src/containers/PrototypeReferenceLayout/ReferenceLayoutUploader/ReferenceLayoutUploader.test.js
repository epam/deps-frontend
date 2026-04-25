
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { ReferenceLayoutUploader } from './ReferenceLayoutUploader'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ReferenceLayoutUploader', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      onFilesSelected: jest.fn(),
      renderUploadTrigger: jest.fn(),
    }

    wrapper = shallow(<ReferenceLayoutUploader {...defaultProps} />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
