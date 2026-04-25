
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Button } from '@/components/Button'
import { UnsupportedFilesList } from '.'

const mockFiles1 = ['mockFilename']
const mockFiles2 = ['mockFilename1', 'mockFilename2']

jest.mock('@/utils/env', () => mockEnv)

describe('Component: UnsupportedFilesList', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      files: mockFiles2,
    }
    wrapper = shallow(<UnsupportedFilesList {...defaultProps} />)
  })

  it('should render message and a button when given several files', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render expanded layout and remove button on click', () => {
    wrapper.find(Button.Link).props().onClick()
    expect(wrapper).toMatchSnapshot()
  })

  it('should render only message when given one file', () => {
    defaultProps.files = mockFiles1
    wrapper.setProps(defaultProps)
    expect(wrapper).toMatchSnapshot()
  })
})
