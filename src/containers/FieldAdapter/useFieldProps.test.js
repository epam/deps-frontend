
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import {
  setActiveField,
  highlightPolygonCoordsField,
  highlightTextCoordsField,
  highlightTableCoordsField,
} from '@/actions/documentReviewPage'
import { updateExtractedData, storeValidation } from '@/actions/documents'
import { documentsApi } from '@/api/documentsApi'
import { documentTypesApi } from '@/api/documentTypesApi'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField, documentTypeFieldShape } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { ExtractedDataField, extractedDataFieldShape, FieldData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { Rect } from '@/models/Rect'
import {
  SourceBboxCoordinates,
  SourceCellCoordinate,
  SourceCellRange,
  SourceCharRange,
  SourceTableCoordinates,
  SourceTextCoordinates,
} from '@/models/SourceCoordinates'
import { TableCoordinates } from '@/models/TableCoordinates'
import {
  documentSelector,
  documentTypeSelector,
  highlightedFieldSelector,
  idSelector,
} from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'
import { useFieldProps } from './useFieldProps'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/authorization')
jest.mock('@/selectors/requests')
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/navigation')
jest.mock('@/actions/documents', () => ({
  updateExtractedData: jest.fn(),
  storeValidation: jest.fn(),
}))
jest.mock('@/actions/documentReviewPage', () => ({
  highlightTableCoordsField: jest.fn(),
  highlightPolygonCoordsField: jest.fn(),
  highlightTextCoordsField: jest.fn(),
  setHighlightedField: jest.fn(),
  setActiveField: jest.fn(),
}))
jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    saveEdField: jest.fn(),
  },
}))
jest.mock('@/api/documentTypesApi', () => ({
  documentTypesApi: {
    validateField: jest.fn(),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

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
  false,
  false,
)

const stringField = new ExtractedDataField(
  1,
  new FieldData('String value', new FieldCoordinates(2, 0.19, 0.26, 0.80, 0.5), 0.69),
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

documentTypeSelector.mockImplementation(() => ({
  code: 'mockDocumentTypeCode',
  name: 'Mock Document Type',
}))

idSelector.mockImplementation(() => '12345')

const HookWrapper = ({ dtField, edField }) => <div {...useFieldProps(dtField, edField)} />

HookWrapper.propTypes = {
  dtField: documentTypeFieldShape.isRequired,
  edField: extractedDataFieldShape.isRequired,
}

describe('Hook: useFieldProps', () => {
  let defaultProps, wrapper

  beforeEach(() => {
    jest.clearAllMocks()
    documentsApi.saveEdField.mockResolvedValue({})
    documentTypesApi.validateField.mockResolvedValue(null)

    defaultProps = {
      dtField: mockStringFieldType,
      edField: stringField,
    }

    wrapper = shallow(<HookWrapper {...defaultProps} />)
  })

  it('should not call updateExtractedData when calling onChangeData and data value was not changed', () => {
    const { onChangeData } = wrapper.props()
    onChangeData('String value')
    expect(updateExtractedData).not.toBeCalled()
  })

  it('should not call updateExtractedData when calling onChangeData and data value not changed', () => {
    const { onChangeData } = wrapper.props()
    onChangeData('some_new_value')
    expect(updateExtractedData).toHaveBeenCalledTimes(1)
  })

  it('should call setActiveField with correct arguments when calling onFocus', () => {
    const { onFocus } = wrapper.props()
    onFocus()
    expect(setActiveField).toHaveBeenCalledWith(defaultProps.dtField.pk)
  })

  it('should return true for isRevertDisabled if no changes was made', () => {
    expect(wrapper.props().isRevertDisabled).toBe(true)
  })

  it('should return false for isRevertDisabled if for fieldType TABLE', () => {
    defaultProps.dtField.fieldType = FieldType.TABLE
    wrapper.setProps(defaultProps)
    expect(wrapper.props().isRevertDisabled).toBe(true)
  })

  it('should call highlightPolygonCoordsField in case of highlighting field with sourceBboxCoordinates', () => {
    const mockSourceId = '12345'
    const mockCoords = [new Rect(1, 2, 3, 4)]

    defaultProps.edField = new ExtractedDataField(
      1,
      new FieldData(
        'val',
        null,
        0.5,
        null,
        undefined,
        null,
        [
          new SourceBboxCoordinates(
            mockSourceId,
            1,
            mockCoords,
          )],
      ),
    )

    highlightedFieldSelector.mockImplementationOnce(() => [mockCoords])

    wrapper = shallow(<HookWrapper {...defaultProps} />)

    const { setHighlightedField } = wrapper.props()
    setHighlightedField()

    expect(highlightPolygonCoordsField).nthCalledWith(1, {
      field: mockCoords,
      sourceId: mockSourceId,
    })
  })

  it('should call highlightTableCoordsField in case of highlighting field with sourceTableCoordinates', () => {
    const mockSourceId = '12345'

    defaultProps.edField = new ExtractedDataField(
      1,
      new FieldData(
        1234,
        null,
        0.5,
        null,
        undefined,
        [
          new SourceTableCoordinates(
            mockSourceId,
            [
              new SourceCellRange(
                new SourceCellCoordinate(1, 2),
                new SourceCellCoordinate(1, 2),
              ),
            ],
          )],
      ),
    )

    wrapper = shallow(<HookWrapper {...defaultProps} />)

    const { setHighlightedField } = wrapper.props()
    setHighlightedField()

    expect(highlightTableCoordsField).nthCalledWith(1, {
      field: [[1, 2, 1, 2]],
      sourceId: mockSourceId,
    })
  })

  it('should call highlightTextCoordsField in case of highlighting field with sourceTextCoordinates', () => {
    const mockSourceId = '12345'

    defaultProps.edField = new ExtractedDataField(
      1,
      new FieldData(
        1234,
        null,
        0.5,
        null,
        undefined,
        null,
        null,
        undefined,
        undefined,
        [
          new SourceTextCoordinates(
            mockSourceId,
            [
              new SourceCharRange(1, 2),
              new SourceCharRange(4, 6),
            ],
          )],
      ),
    )

    wrapper = shallow(<HookWrapper {...defaultProps} />)

    const { setHighlightedField } = wrapper.props()
    setHighlightedField()

    expect(highlightTextCoordsField).nthCalledWith(1, {
      field: [
        new SourceCharRange(1, 2),
        new SourceCharRange(4, 6),
      ],
      sourceId: mockSourceId,
    })
  })

  it('should call highlightTableCoordsField in case of highlighting field with tableCoordinates', () => {
    const mockPage = 2

    defaultProps.edField = new ExtractedDataField(
      1,
      new FieldData(
        1234,
        null,
        0.5,
        [new TableCoordinates(mockPage, [[1, 1]])],
      ),
    )

    wrapper = shallow(<HookWrapper {...defaultProps} />)

    const { setHighlightedField } = wrapper.props()
    setHighlightedField()

    expect(highlightTableCoordsField).nthCalledWith(1, {
      field: [[1, 1]],
      page: mockPage,
    })
  })

  it('should call highlightPolygonCoordsField in case of highlighting field with data coordinates', () => {
    const mockPage = 2

    defaultProps.edField = new ExtractedDataField(
      1,
      new FieldData(
        1234,
        [
          new FieldCoordinates(mockPage, 0.1, 0.2, 0.8, 0.5),
        ],
        0.5,
      ),
    )

    wrapper = shallow(<HookWrapper {...defaultProps} />)

    const { setHighlightedField } = wrapper.props()
    setHighlightedField()

    expect(highlightPolygonCoordsField).nthCalledWith(1, {
      field: [new Rect(0.1, 0.2, 0.8, 0.5)],
      page: mockPage,
    })
  })

  it('should return value as is for getValueToDisplay if feature for display mode is off', () => {
    ENV.FEATURE_FIELDS_DISPLAY_MODE = false

    expect(wrapper.props().getValueToDisplay()).toBe(defaultProps.edField.data.value)

    ENV.FEATURE_FIELDS_DISPLAY_MODE = true
  })

  it('should return value as is for getValueToDisplay if dtField confidential flag is off', () => {
    defaultProps.dtField.confidential = false

    wrapper.setProps(defaultProps)

    expect(wrapper.props().getValueToDisplay()).toBe(defaultProps.edField.data.value)
  })

  it('should return masked value for getValueToDisplay if dtField confidential flag is on', () => {
    const charLimit = 1
    defaultProps.dtField.confidential = true
    defaultProps.edField.data.value = 'abc'

    wrapper.setProps(defaultProps)

    expect(wrapper.props().getValueToDisplay(charLimit)).toBe('a**')
  })

  it('should skip validation API when FEATURE_PER_FIELD_VALIDATION is disabled', async () => {
    ENV.FEATURE_PER_FIELD_VALIDATION = false

    const { onChangeData } = wrapper.props()
    await onChangeData('new value')

    await flushPromises()

    expect(documentsApi.saveEdField).toHaveBeenCalledTimes(1)
    expect(documentTypesApi.validateField).not.toHaveBeenCalled()
    expect(storeValidation).not.toHaveBeenCalled()

    ENV.FEATURE_PER_FIELD_VALIDATION = true
  })

  it('should call validation after successful field save', async () => {
    const mockValidation = {
      fieldValidations: [],
      crossFieldValidations: [],
    }
    documentsApi.saveEdField.mockResolvedValue({})
    documentTypesApi.validateField.mockResolvedValue(mockValidation)

    const { onChangeData } = wrapper.props()
    await onChangeData('new value')

    await flushPromises()

    expect(documentsApi.saveEdField).toHaveBeenCalledTimes(1)
    expect(documentTypesApi.validateField).toHaveBeenNthCalledWith(
      1,
      'mockDocumentTypeCode',
      'verticalReference',
      '12345',
    )
    expect(storeValidation).toHaveBeenNthCalledWith(
      1,
      expect.any(String),
      mockValidation,
    )
  })

  it('should not call validation if save fails', async () => {
    documentsApi.saveEdField.mockRejectedValue(new Error('Save failed'))
    documentTypesApi.validateField.mockResolvedValue({})

    const { onChangeData } = wrapper.props()

    await onChangeData('new value').catch(() => { })

    await flushPromises()

    expect(documentsApi.saveEdField).toHaveBeenCalledTimes(1)
    expect(documentTypesApi.validateField).not.toHaveBeenCalled()
  })
})
