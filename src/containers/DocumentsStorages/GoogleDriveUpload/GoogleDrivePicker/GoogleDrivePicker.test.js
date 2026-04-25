
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { MimeType } from '@/enums/MimeType'
import { StorageFile } from '../../models/StorageFile'
import { StorageButton } from '../../StorageButton'
import { GoogleDrivePicker } from './GoogleDrivePicker'

const mockOpenPicker = jest.fn((params) => params)

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-google-drive-picker', () => ({
  __esModule: true,
  default: jest.fn(() => [mockOpenPicker]),
}))

const mockFile = new StorageFile({
  id: 'id',
  sizeBytes: 123,
  name: 'name.pdf',
  mimeType: MimeType.APPLICATION_PDF,
})

const mockInvalidFile = {
  id: 'id2',
  sizeBytes: 123,
  name: 'name.example',
  mimeType: 'invalidMimeType',
}

describe('Container: GoogleDrivePicker', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      files: [mockFile],
      onFileValidationFailed: jest.fn(),
      onSizeValidationFailed: jest.fn(),
      setFiles: jest.fn(),
      disabled: false,
    }

    wrapper = shallow(<GoogleDrivePicker {...defaultProps} />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call openPicker when click on StorageButton', () => {
    wrapper.find(StorageButton).props().onClick()

    expect(mockOpenPicker).toHaveBeenCalled()
  })

  it('should not call setFiles if no docs provided', () => {
    const params = wrapper.find(StorageButton).props().onClick()

    params.callbackFunction({})

    expect(defaultProps.setFiles).not.toHaveBeenCalled()
  })

  it('should not call setFiles if docs provided but they are invalid', () => {
    const params = wrapper.find(StorageButton).props().onClick()

    const copyMockFile = { ...mockFile }
    copyMockFile.mimeType = 'test'

    params.callbackFunction({ docs: [copyMockFile] })

    expect(defaultProps.setFiles).not.toHaveBeenCalled()
  })

  it('should call setFiles if at least one of provided docs is valid', () => {
    const params = wrapper.find(StorageButton).props().onClick()

    const copyMockFile = { ...mockFile }

    params.callbackFunction({ docs: [copyMockFile, mockInvalidFile] })

    expect(defaultProps.setFiles).toHaveBeenCalled()
  })

  it('should call setFiles if provided valid docs', () => {
    const params = wrapper.find(StorageButton).props().onClick()

    params.callbackFunction({ docs: [mockFile] })

    expect(defaultProps.setFiles).toHaveBeenCalled()
  })
})
