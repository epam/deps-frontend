
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import Upload from 'antd/es/upload'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import { UploadIcon } from '@/components/Icons/UploadIcon'
import { SUPPORTED_EXTENSIONS_DOCUMENTS } from '@/constants/common'
import { FileExtension } from '@/enums/FileExtension'
import { MimeType } from '@/enums/MimeType'
import { localize, Localization } from '@/localization/i18n'
import { getMime } from '@/utils/getMime'
import { FilesPicker, PICKER_TYPES } from './'

const mockMimeType = MimeType.IMAGE_JPEG
const mockExtensions = [FileExtension.JPG, FileExtension.JPEG]
const mockFileType = 'image/jpeg'
const mockFile = {
  name: 'file',
  size: 1000000,
  type: mockFileType,
  mime: MimeType.IMAGE_JPEG,
}
const mockFiles = [
  {
    name: 'file1',
    size: 94371840,
  },
  {
    name: 'file2',
    size: 94371840,
  },
]

jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/utils/getMime', () => ({
  getExtensionsFromMime: jest.fn(() => mockExtensions),
}))

jest.mock('@/utils/math', () => ({
  convertBytesToMegaBytes: jest.fn((fileSize) => fileSize / 1024 / 1024),
}))
jest.mock('@/utils/env', () => mockEnv)

const Dragger = Upload.Dragger

describe('Component: FilesPicker', () => {
  let defaultProps
  let filesPickerDragger, filesPickerButton

  beforeEach(() => {
    defaultProps = {
      className: 'css class',
      disabled: false,
      accept: SUPPORTED_EXTENSIONS_DOCUMENTS.join(', '),
      icon: <UploadIcon />,
      text: 'Click or drag and drop to select documents',
      description: 'Supported formats: .jpg,.jpeg,.png,.pdf',
      onFilesSelected: jest.fn(),
      onFileSelected: jest.fn(),
      maxFileSize: 100,
      onFileSizeValidationFailed: jest.fn(),
      onFilesLoadInProgressMessage: jest.fn(),
      onFilesValidationFailed: jest.fn(),
      getMime: jest.fn(() => Promise.resolve(mockMimeType)),
    }
    filesPickerDragger = shallow(
      <FilesPicker
        type={PICKER_TYPES.DRAGGER}
        {...defaultProps}
      />,
    )
    filesPickerButton = shallow(
      <FilesPicker
        type={PICKER_TYPES.FILE}
        {...defaultProps}
      />,
    )
  })

  it('should render upload button and pass correct props', () => {
    expect(filesPickerButton).toMatchSnapshot()
  })

  it('should render dragger and pass correct props', () => {
    expect(filesPickerDragger).toMatchSnapshot()
  })

  it('should pass correct callback to Dragger and Upload buttons as beforeUpload prop', () => {
    const uploadButtons = filesPickerButton.find(Upload)
    uploadButtons.forEach((element) => expect(element.props().beforeUpload).toEqual(filesPickerButton.instance().beforeUpload))
    expect(filesPickerDragger.find(Dragger).props().beforeUpload).toEqual(filesPickerDragger.instance().beforeUpload)
  })

  const shouldCallOnFileSelectedWithCorrectArgs = (props, expect) => {
    filesPickerDragger.setProps({
      ...props,
      onFileSelected: (file) => {
        expect(file)
      },
    })
    filesPickerDragger.instance().beforeUpload(mockFile, mockFiles)
  }

  it('should pass file to mime type util and call props.onFileSelected with correct file in case file is supported', (done) => {
    shouldCallOnFileSelectedWithCorrectArgs(defaultProps, (file) => {
      expect(getMime).toHaveBeenCalledWith(file)
      expect(file).toEqual(mockFile)
    })
    done()
  })

  it('should call props.onFileSelected with correct file in case mime type of the file is in extensions from mime', (done) => {
    const updatedProps = {
      ...defaultProps,
      getMime: () => Promise.resolve(MimeType.IMAGE_JPEG),
    }
    shouldCallOnFileSelectedWithCorrectArgs(updatedProps, (file) => {
      expect(file).toEqual(mockFile)
    })
    done()
  })

  it('should call props.onFileSelected with correct file in case !props.accept', (done) => {
    shouldCallOnFileSelectedWithCorrectArgs({
      ...defaultProps,
      accept: undefined,
    }, (file) => {
      expect(file).toEqual(mockFile)
    })
    done()
  })

  it('should call props.onFilesSelected with correct supportedFiles and unsupportedFiles in case processedFilesCounter === fileList.length', (done) => {
    const mockFile = {
      name: 'files',
      size: 100000000,
      type: mockFileType,
      mime: MimeType.APPLICATION_PDF,
    }

    filesPickerDragger.setProps({
      ...defaultProps,
      onFilesSelected: (supportedFiles, unsupportedFiles) => {
        expect(filesPickerDragger.instance().supportedFiles).toEqual(supportedFiles)
        expect(filesPickerDragger.instance().unsupportedFiles).toEqual(unsupportedFiles)
        expect(supportedFiles).toEqual(filesPickerDragger.instance().supportedFiles)
      },
    })

    filesPickerDragger.instance().beforeUpload(mockFile, [mockFile])
    done()
  })

  it('should call notifyProgress once on beforeUpload call', () => {
    filesPickerDragger.instance().beforeUpload(mockFile, [mockFiles])
    expect(mockNotification.notifyProgress).nthCalledWith(1, localize(Localization.CURRENTLY_ADDING_FILES))
  })

  it('should call props.onFileSizeValidationFailed with correct file in case file size is too big', () => {
    const mockBigFile = {
      name: 'file',
      size: 105_906_176,
    }
    filesPickerDragger.instance().isSizeValid(mockBigFile)
    expect(defaultProps.onFileSizeValidationFailed).nthCalledWith(1)
  })

  it('should validate file format and call notifyWarning for unsupported files in handleDrop', async () => {
    const mockEvent = {
      dataTransfer: {
        files: [
          {
            name: 'file.json',
            size: 110,
            type: 'application/json',
          },
        ],
      },
    }

    await filesPickerButton.instance().handleDrop(mockEvent)

    expect(mockNotification.notifyWarning).nthCalledWith(
      1,
      localize(Localization.FILE_UNSUPPORTED_FORMAT, { fileName: 'file.json' }))
  })

  it('should work when onFilesValidationFailed is not provided', async () => {
    const propsWithoutValidationFailed = {
      ...defaultProps,
      onFilesValidationFailed: undefined,
    }

    filesPickerDragger.setProps(propsWithoutValidationFailed)

    const mockFile = {
      name: 'unsupported.json',
      size: 1000000,
      type: 'application/json',
      mime: 'application/json',
    }

    filesPickerDragger.instance().beforeUpload(mockFile, [mockFile])

    await flushPromises()

    expect(filesPickerDragger.instance().unsupportedFiles).toEqual([])
    expect(filesPickerDragger.instance().supportedFiles).toEqual([])
  })

  it('should work when onFileSizeValidationFailed is not provided and maxFileSize is not set', () => {
    const propsWithoutSizeValidation = {
      ...defaultProps,
      maxFileSize: undefined,
      onFileSizeValidationFailed: undefined,
    }

    filesPickerDragger.setProps(propsWithoutSizeValidation)

    const mockBigFile = {
      name: 'file',
      size: 105_906_176,
    }

    const result = filesPickerDragger.instance().isSizeValid(mockBigFile)
    expect(result).toBe(true)
  })

  it('should call onFilesValidationFailed when provided and unsupported files exist', async () => {
    const mockOnFilesValidationFailed = jest.fn()
    const propsWithValidationFailed = {
      ...defaultProps,
      onFilesValidationFailed: mockOnFilesValidationFailed,
    }

    filesPickerDragger.setProps(propsWithValidationFailed)

    const mockFile = {
      name: 'unsupported.json',
      size: 1000000,
      type: 'application/json',
      mime: 'application/json',
    }

    filesPickerDragger.instance().beforeUpload(mockFile, [mockFile])

    await flushPromises()

    expect(mockOnFilesValidationFailed).toHaveBeenCalledWith(['unsupported.json'], [mockFile])
  })
})
