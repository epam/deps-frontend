
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { SelectOption } from '@/components/Select'
import { WarningBanner } from '@/containers/DocumentUploadItem/DocumentUploadItem.styles'
import { ComponentSize } from '@/enums/ComponentSize'
import { MimeType } from '@/enums/MimeType'
import { UploadStatus } from '@/enums/UploadStatus'
import { DocumentToUpload } from '@/models/DocumentToUpload'
import { DocumentUploadItem } from '../DocumentUploadItem'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: DocumentUploadItem', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      document: new DocumentToUpload({
        uid: 'mockUID1',
        name: 'mockName.pdf',
        files: [
          {
            uid: 'mockUID1',
            name: 'mockName.pdf',
          },
        ],
      }),
      size: ComponentSize.SMALL,
      deleteFile: jest.fn(),
      documentUploadState: {
        files: {
          mockUID1: 100,
        },
        status: UploadStatus.SUCCESS,
      },
      uploadStatus: UploadStatus.SUCCESS,
      uploading: false,
      renderDocumentControls: jest.fn(),
      documentTypes: [
        new SelectOption('mockOptionValue', 'mockOptionText'),
      ],
      engines: [
        new SelectOption('mockOptionValue', 'mockOptionText'),
      ],
    }

    wrapper = shallow(<DocumentUploadItem {...defaultProps} />)
  })

  it('should render DocumentUploadCard', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render DocumentUploadCard with warning banner', () => {
    const mailDocument = new DocumentToUpload({
      uid: 'mockUID1',
      name: 'mockName.eml',
      files: [
        {
          uid: 'mockUID1',
          name: 'mockName.eml',
          mime: MimeType.MAIL_EML,
        },
      ],
    })

    defaultProps.document = mailDocument
    defaultProps.uploadStatus = UploadStatus.PENDING
    wrapper.setProps({ ...defaultProps })

    expect(wrapper.find(WarningBanner)).toMatchSnapshot()
  })

  it('should render OverrideDocumentOption in case of proper props.document.documentTypes', () => {
    defaultProps.document.documentType = 'mockOptionValue'
    wrapper.setProps(defaultProps)
    expect(wrapper.instance().renderDocumentTitleAndOverriddenOptions()).toMatchSnapshot()
  })

  it('should render OverrideDocumentOption in case of proper props.document.engine', () => {
    defaultProps.document.engine = 'mockOptionValue'
    wrapper.setProps(defaultProps)
    expect(wrapper.instance().renderDocumentTitleAndOverriddenOptions()).toMatchSnapshot()
  })
})
