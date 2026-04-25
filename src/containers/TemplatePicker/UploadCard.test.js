
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Button } from '@/components/Button'
import { UploadCard } from './UploadCard'

jest.mock('@/utils/env', () => mockEnv)

const mockFile = {
  uid: '12345',
  mime: 'png',
  type: 'image',
  name: 'test',
  size: 123,
}

const mockChildren = <Button />

describe('Component: UploadCard', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      file: mockFile,
      children: mockChildren,
    }

    wrapper = shallow(<UploadCard {...defaultProps} />)
  })

  it('should render UploadCard with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render UploadCard correctly with unknown mime type', () => {
    defaultProps.file.mime = 'unknown'

    wrapper = shallow(<UploadCard {...defaultProps} />)

    expect(wrapper).toMatchSnapshot()
  })
})
