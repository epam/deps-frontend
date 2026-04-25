
import { mockDayjs } from '@/mocks/mockDayjs'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { SelectOption } from '@/components/Select'
import { DocumentUploadItem } from '@/containers/DocumentUploadItem'
import { DocumentUploadList } from '@/containers/DocumentUploadList'
import { DocumentsTable } from '@/containers/DocumentUploadList/DocumentUploadList.styles'
import { ComponentSize } from '@/enums/ComponentSize'
import { UploadStatus } from '@/enums/UploadStatus'
import { DocumentToUpload } from '@/models/DocumentToUpload'
import { ExpandButton } from './ExpandButton'

jest.mock('dayjs', () => mockDayjs())
jest.mock('@/utils/env', () => mockEnv)

describe('Component: DocumentUploadList', () => {
  const mockDocumentWithOneFile = new DocumentToUpload({
    uid: 'mockUIDFile1',
    name: 'date - mockDocumentName1.pdf',
    files: [
      {
        uid: 'mockUIDFile1',
        name: 'mockFileName1',
      },
    ],
  })

  const mockDocumentWithTwoFile = new DocumentToUpload({
    uid: 'mockUIDFile2',
    name: 'date - mockDocumentName2.pdf',
    files: [
      {
        uid: 'mockUIDFile2',
        name: 'mockFileName2',
      },
      {
        uid: 'mockUIDFile22',
        name: 'mockFileName22',
      },
    ],
  })

  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      documents: [{ ...mockDocumentWithOneFile }],
      uploadState: {
        [mockDocumentWithOneFile.uid]: {
          files: {
            [mockDocumentWithOneFile.files[0].uid]: 90,
          },
          status: UploadStatus.PENDING,
        },
      },
      size: ComponentSize.SMALL,
      onDocumentsChange: jest.fn(),
      renderDocumentControls: jest.fn(),
      uploading: false,
      documentTypes: [
        new SelectOption('mockValue', 'mockText'),
      ],
      engines: [
        new SelectOption('mockValue', 'mockText'),
      ],
    }

    wrapper = shallow(<DocumentUploadList {...defaultProps} />)
  })

  it('should render DocumentsTable and AddDocumentsButton', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render DocumentsTable in case empty props.documents', () => {
    defaultProps.documents = []
    wrapper.setProps(defaultProps)
    expect(wrapper.find(DocumentsTable).exists()).toEqual(false)
  })

  it('should pass correct callbacks to DocumentUploadItem', () => {
    const documentUploadProps = wrapper.find(DocumentUploadItem).first().props()
    expect(documentUploadProps.addFiles).toEqual(wrapper.instance().addFiles)
    expect(documentUploadProps.deleteFile).toEqual(wrapper.instance().deleteFile)
  })

  it('should pass UploadStatus.PENDING to uploadStatus DocumentUpload in case empty props.uploadState', () => {
    defaultProps.uploadState = {}
    wrapper.setProps(defaultProps)
    const documentUploadProps = wrapper.find(DocumentUploadItem).first().props()
    expect(documentUploadProps.uploadStatus).toEqual(UploadStatus.PENDING)
  })

  it('should call props.onDocumentsChange with correct args when calling to deleteFile', () => {
    defaultProps.documents = [{ ...mockDocumentWithTwoFile }]
    wrapper.setProps(defaultProps)
    const [mockFromDocument] = defaultProps.documents
    const [mockFile] = defaultProps.documents[0].files
    wrapper.instance().deleteFile(mockFromDocument, mockFile)
    defaultProps.documents[0].files.shift()

    expect(defaultProps.onDocumentsChange).toHaveBeenCalledWith(defaultProps.documents)
  })

  it('should call props.onDocumentsChange with correct args when calling to deleteFile and fromDocument.files.length === 1', () => {
    const { 0: mockFromDocument } = defaultProps.documents
    const [mockFile] = defaultProps.documents[0].files
    wrapper.instance().deleteFile(mockFromDocument, mockFile)
    defaultProps.documents.pop()

    expect(defaultProps.onDocumentsChange).toHaveBeenCalledWith(defaultProps.documents)
  })

  it('should render ExpandButton if props.documents.length > 3', () => {
    defaultProps.documents = Array(10).fill(mockDocumentWithOneFile)

    wrapper.setProps(defaultProps)

    expect(
      wrapper.find(ExpandButton).exists(),
    ).toBe(true)
  })

  it('should show only 3 documents if UploadList is collapsed', () => {
    defaultProps.documents = Array(10).fill(mockDocumentWithOneFile)

    wrapper.setProps(defaultProps)

    expect(wrapper.find(DocumentUploadItem)).toHaveLength(3)
  })

  it('should show all documents if UploadList is expanded', () => {
    const documentsCount = 10
    defaultProps.documents = Array(documentsCount).fill(mockDocumentWithOneFile)

    wrapper.setProps(defaultProps)

    wrapper.instance().toggleListView()

    expect(wrapper.find(DocumentUploadItem)).toHaveLength(documentsCount)
  })
})
