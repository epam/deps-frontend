
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField, documentTypeFieldShape, VALUE_INDEX } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { ExtractedDataField, FieldData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { documentSelector } from '@/selectors/documentReviewPage'
import { externalOneTimeRender } from '@/utils/externalOneTimeRender'
import { useCommandExtractionProps } from './useCommandExtractionProps'

let RegionAreaPicker

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/authorization')
jest.mock('@/selectors/requests')
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/navigation')
jest.mock('@/actions/documents', () => ({
  updateExtractedData: jest.fn(),
}))
jest.mock('@/utils/externalOneTimeRender', () => ({
  externalOneTimeRender: jest.fn((c) => {
    RegionAreaPicker = c
  }),
}))

const mockDocument = documentSelector.getSelectorMockValue()

const mockStringFieldType = new DocumentTypeField(
  'verticalReference',
  'Vertical Reference',
  new DocumentTypeFieldMeta('BC', 'A'),
  FieldType.STRING,
  false,
  1,
  'mockDocumentTypeCode',
  1,
)

const stringField = new ExtractedDataField(
  1,
  new FieldData(
    'String value',
    new FieldCoordinates(2, 0.19, 0.26, 0.80, 0.5),
    0.69,
  ),
)

const mockFile = {
  blobName: 'test.txt',
  url: 'test.txt',
}

documentSelector.mockImplementation(() => ({
  ...mockDocument,
  extractedData: [
    stringField,
  ],
  initialDocumentData: [
    stringField,
  ],
  files: [
    mockFile,
  ],
}))

const HookWrapper = ({ dtField }) => <div {...useCommandExtractionProps(dtField)} />

HookWrapper.propTypes = {
  dtField: documentTypeFieldShape.isRequired,
}

describe('Hook: useCommandExtractionProps', () => {
  let defaultProps, wrapper

  beforeEach(() => {
    defaultProps = {
      dtField: mockStringFieldType,
    }

    wrapper = shallow(<HookWrapper {...defaultProps} />)
    jest.clearAllMocks()
  })

  it('should return false for string field type document type DOCX', () => {
    expect(wrapper.props().isExtractionDisabled).toBe(false)
  })

  it('should return true for isExtractionDisabled for document with DOCX extension', () => {
    const mockDOCXFiles = [{
      blobName: 'test.docx',
      url: 'test.docx',
    }]
    documentSelector.mockImplementationOnce(() => ({
      ...documentSelector.getSelectorMockValue(),
      files: mockDOCXFiles,
    }))

    wrapper = shallow(<HookWrapper {...defaultProps} />)
    expect(wrapper.props().isExtractionDisabled).toBe(true)
  })

  it('should return true for isExtractionDisabled for fieldType Table', () => {
    defaultProps.dtField.fieldType = FieldType.TABLE
    wrapper.setProps(defaultProps)
    expect(wrapper.props().isExtractionDisabled).toBe(true)
  })

  it('should call externalOneTimeRender with correct args when openExtractAreaModal was called', () => {
    const { openExtractAreaModal } = wrapper.props()
    openExtractAreaModal(VALUE_INDEX)
    expect(externalOneTimeRender).nthCalledWith(
      1,
      expect.any(Function),
      { onOk: expect.any(Function) },
    )
  })

  it('should render RegionAreaPicker in case externalOneTimeRender is called', () => {
    const { openExtractAreaModal } = wrapper.props()
    openExtractAreaModal(VALUE_INDEX)

    expect(shallow(
      <RegionAreaPicker
        onCancel={jest.fn()}
        onOk={jest.fn()}
      />,
    )).toMatchSnapshot()
  })
})
