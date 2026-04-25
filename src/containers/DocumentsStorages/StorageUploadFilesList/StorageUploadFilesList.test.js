
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { MimeType } from '@/enums/MimeType'
import { StorageFile } from '../models/StorageFile'
import { StorageUploadFile } from '../StorageUploadFile'
import { ToggleButton } from '../ToggleButton'
import { StorageUploadFilesList } from './StorageUploadFilesList'

const mockFile = new StorageFile({
  id: 'id',
  sizeBytes: 123,
  name: 'name.pdf',
  mimeType: MimeType.APPLICATION_PDF,
})

jest.mock('@/utils/env', () => mockEnv)

describe('Container: StorageUploadFilesList', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      removeFile: jest.fn(),
      files: [mockFile],
    }

    wrapper = shallow(<StorageUploadFilesList {...defaultProps} />)
  })

  it('should render StorageUploadFilesList correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call removeFile when call the same prop in StorageUploadFile', () => {
    wrapper.find(StorageUploadFile).props().removeFile()

    expect(defaultProps.removeFile).toHaveBeenCalled()
  })

  it('should render ToggleButton if props.files.length > 3', () => {
    defaultProps.files = Array(10).fill(mockFile)

    wrapper.setProps(defaultProps)

    expect(wrapper.find(ToggleButton).exists()).toBe(true)
  })

  it('should show only 3 files if StorageUploadFilesList is collapsed', () => {
    defaultProps.files = Array(10).fill(mockFile)

    wrapper.setProps(defaultProps)

    expect(wrapper.find(StorageUploadFile)).toHaveLength(3)
  })

  it('should show all files if StorageUploadFilesList is expanded', () => {
    const filesQuantity = 10
    defaultProps.files = Array(filesQuantity).fill(mockFile)

    wrapper.setProps(defaultProps)
    wrapper.find(ToggleButton).props().toggleView()

    expect(wrapper.find(StorageUploadFile)).toHaveLength(filesQuantity)
  })
})
