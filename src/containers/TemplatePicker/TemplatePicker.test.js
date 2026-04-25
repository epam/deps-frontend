
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { shallow } from 'enzyme'
import { TemplatePicker } from './TemplatePicker'
import { FilesPicker } from './TemplatePicker.styles'

const mockFile = {
  uid: '12345',
  mime: 'image/png',
  type: '.png',
  name: 'test',
  size: 123,
}

jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/utils/env', () => mockEnv)

describe('Component: TemplatePicker', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      file: mockFile,
      setUploadedFile: jest.fn(),
    }

    wrapper = shallow(<TemplatePicker {...defaultProps} />)
  })

  it('should render TemplatePicker correctly without selected file', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render TemplatePicker with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should save into the state file when upload it with FilePicker', () => {
    wrapper.find(FilesPicker).props().onFilesSelected([mockFile])

    expect(defaultProps.setUploadedFile).nthCalledWith(1, mockFile)
  })

  it('should return correct file mime type', async () => {
    const mimeType = await wrapper.find(FilesPicker).props().getMime(mockFile)

    expect(mimeType).toBe(mockFile.type)
  })

  it('should call notifyWarning if unsupported file type  was selected', () => {
    wrapper.find(FilesPicker).props().onFilesValidationFailed([])

    expect(mockNotification.notifyWarning).toHaveBeenCalledTimes(1)
  })
})
