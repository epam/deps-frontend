
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { BanIcon } from '@/components/Icons/BanIcon'
import { CheckIcon } from '@/components/Icons/CheckIcon'
import { FileDOCXIcon } from '@/components/Icons/FileDOCXIcon'
import { FileImageIcon } from '@/components/Icons/FileImageIcon'
import { FileJPGIcon } from '@/components/Icons/FileJPGIcon'
import { FileMailIcon } from '@/components/Icons/FileMailIcon'
import { FilePDFIcon } from '@/components/Icons/FilePDFIcon'
import { FileXLSXIcon } from '@/components/Icons/FileXLSXIcon'
import { Progress } from '@/components/Progress'
import { MimeType } from '@/enums/MimeType'
import { UploadStatus } from '@/enums/UploadStatus'
import { getFileSizeStr } from '@/utils/file'
import { shallowWithTheme } from '@/utils/shallowWithTheme'
import { DocumentFileUploadItem } from '../DocumentFileUploadItem'
import { ListItem } from '../DocumentFileUploadItem.styles'

jest.mock('@/utils/file', () => ({
  getFileSizeStr: jest.fn(() => '74 KB'),
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Component: DocumentFileUploadItem', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      file: {
        uid: 'mockID1',
        name: 'mockName.pdf',
      },
      documentUploadState: {
        files: {
          mockID1: 90,
        },
        status: UploadStatus.PENDING,
      },
      document: {
        uid: 'mockID1',
        name: 'date - mockName.pdf',
        files: [
          {
            uid: 'mockID1',
            name: 'mockName',
          },
        ],
      },
      deleteFile: jest.fn(),
      uploading: false,
    }

    wrapper = shallowWithTheme(<DocumentFileUploadItem {...defaultProps} />)
  })

  it('should render correct Avatar with correct IconType according to MimeType', () => {
    Object.values(MimeType).forEach((mimeType) => {
      defaultProps.file.mime = mimeType
      wrapper.setProps(defaultProps)
      const Avatar = shallow(wrapper.instance().renderIcon())
      if (mimeType === MimeType.IMAGE_JPEG) {
        const Icon = Avatar.find(FileJPGIcon)
        expect(Icon.exists()).toEqual(true)
      } else if (mimeType === MimeType.APPLICATION_PDF) {
        const Icon = Avatar.find(FilePDFIcon)
        expect(Icon.exists()).toEqual(true)
      } else if (mimeType === MimeType.APPLICATION_XLSX) {
        const Icon = Avatar.find(FileXLSXIcon)
        expect(Icon.exists()).toEqual(true)
      } else if (mimeType === MimeType.APPLICATION_DOCX) {
        const Icon = Avatar.find(FileDOCXIcon)
        expect(Icon.exists()).toEqual(true)
      } else if (mimeType === MimeType.MAIL_EML || mimeType === MimeType.MAIL_MSG) {
        const Icon = Avatar.find(FileMailIcon)
        expect(Icon.exists()).toEqual(true)
      } else {
        const Icon = Avatar.find(FileImageIcon)
        expect(Icon.exists()).toEqual(true)
      }
    })
  })

  it('should render ListItem with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call props.deleteFile with correct props.document and props.file when call onRemoveClick method', () => {
    wrapper.instance().onRemoveClick()
    expect(defaultProps.deleteFile).nthCalledWith(1, defaultProps.document, defaultProps.file)
  })

  it('should call util getFileSizeStr with correct props.file.size', () => {
    expect(getFileSizeStr).nthCalledWith(1, defaultProps.file.size)
  })

  it('should render Remove action button in case upload state is undefined', () => {
    delete defaultProps.documentUploadState.status

    wrapper = shallowWithTheme(<DocumentFileUploadItem {...defaultProps} />)

    const ButtonLinkRemove = shallow(wrapper.find(ListItem).props().actions[0])
    expect(ButtonLinkRemove.exists()).toBe(true)
  })

  it('should render correct item extra when if upload state === UploadStatus.PENDING', () => {
    defaultProps.documentUploadState.status = UploadStatus.PENDING

    wrapper = shallowWithTheme(<DocumentFileUploadItem {...defaultProps} />)

    expect(wrapper.find(Progress).exists()).toBe(true)
  })

  it('should render correct item extra when if upload state === UploadStatus.FAILURE', () => {
    defaultProps.documentUploadState.status = UploadStatus.FAILURE

    wrapper = shallowWithTheme(<DocumentFileUploadItem {...defaultProps} />)

    expect(wrapper.find(BanIcon).exists()).toBe(true)
  })

  it('should render correct item extra when if upload state === UploadStatus.SUCCESS', () => {
    defaultProps.documentUploadState.status = UploadStatus.SUCCESS

    wrapper = shallowWithTheme(<DocumentFileUploadItem {...defaultProps} />)

    expect(wrapper.find(CheckIcon).exists()).toBe(true)
  })
})
