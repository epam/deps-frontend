
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { OneDriveFile } from '@/containers/DocumentsStorages/models/OneDriveFile'
import { StorageFile } from '@/containers/DocumentsStorages/models/StorageFile'
import { StorageButton } from '@/containers/DocumentsStorages/StorageButton'
import { MimeType } from '@/enums/MimeType'
import { OneDrivePicker } from './OneDrivePicker'

const mockOpenPicker = jest.fn((params) => params)
const mockGetToken = jest.fn(() => 'token')
const mockInitApi = jest.fn()

window.OneDrive = {
  open: mockOpenPicker,
}

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../useOneDriveApi', () => ({
  useOneDriveApi: jest.fn(() => ({
    getToken: mockGetToken,
    initApi: mockInitApi,
  })),
}))

jest.mock('@/hooks/useDynamicScript', () => ({
  useDynamicScript: jest.fn(() => ({
    ready: true,
  })),
}))

const mockFile = new StorageFile({
  id: 'id',
  sizeBytes: 123,
  name: 'name.pdf',
  mimeType: MimeType.APPLICATION_PDF,
})

const mockPickerFile = new OneDriveFile({
  id: 'oneDriveId',
  file: {
    mimeType: MimeType.APPLICATION_PDF,
  },
  name: 'name.pdf',
  size: 345,
})

const mockUnsupportedFile = new OneDriveFile({
  id: 'oneDriveInvalidId',
  file: {
    mimeType: 'invalid/extension',
  },
  name: 'invalid.example',
  size: 345,
})

describe('Container: OneDrivePicker', () => {
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

    wrapper = shallow(<OneDrivePicker {...defaultProps} />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call initApi when click on StorageButton', async () => {
    await wrapper.find(StorageButton).props().onClick()

    expect(mockInitApi).toHaveBeenCalled()
  })

  it('should call openPicker when click on StorageButton', async () => {
    await wrapper.find(StorageButton).props().onClick()

    expect(mockOpenPicker).toHaveBeenCalled()
  })

  it('should not call setFiles if no docs provided', async () => {
    const params = await wrapper.find(StorageButton).props().onClick()

    params.success({})

    expect(defaultProps.setFiles).not.toHaveBeenCalled()
  })

  it('should not call setFiles if docs provided but they are unsupported', async () => {
    const params = await wrapper.find(StorageButton).props().onClick()

    params.success({ value: [mockUnsupportedFile] })

    expect(defaultProps.setFiles).not.toHaveBeenCalled()
  })

  it('should call setFiles if at least one of provided docs is valid', async () => {
    const params = await wrapper.find(StorageButton).props().onClick()

    params.success({ value: [mockPickerFile, mockUnsupportedFile] })

    expect(defaultProps.setFiles).toHaveBeenCalled()
  })

  it('should call setFiles if provided valid docs', async () => {
    const params = await wrapper.find(StorageButton).props().onClick()

    params.success({ value: [mockPickerFile] })

    expect(defaultProps.setFiles).toHaveBeenCalled()
  })
})
