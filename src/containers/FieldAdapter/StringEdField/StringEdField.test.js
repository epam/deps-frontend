
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { FieldValidationResult } from '@/containers/FieldAdapter/FieldValidationResult'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { FieldValidation } from '@/models/DocumentValidation'
import {
  ExtractedDataField,
  FieldData,
} from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { TableCoordinates } from '@/models/TableCoordinates'
import { StringEdField } from './StringEdField'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/documents', () => ({
  updateExtractedData: jest.fn(),
}))

jest.mock('@/hooks/useExpandableText', () => ({
  useExpandableText: jest.fn(() => ({
    ExpandableContainer: ({ children }) => <div>{children}</div>,
    ToggleExpandIcon: () => 'mockIcon',
  })),
}))

const mockFieldValue = 'val'

jest.mock('../useFieldProps', () => ({
  useFieldProps: jest.fn(() => ({
    onChangeData: jest.fn(),
    onFocus: jest.fn(),
    setHighlightedField: jest.fn(),
    highlightArea: jest.fn(),
    revertValue: jest.fn(),
    isRevertDisabled: false,
    getValueToDisplay: jest.fn(() => mockFieldValue),
  })),
}))

jest.mock('../useCommandExtractionProps', () => ({
  useCommandExtractionProps: jest.fn(() => ({
    openExtractAreaModal: jest.fn(),
    isExtractionDisabled: false,
  })),
}))

jest.mock('@/containers/InView', () => mockComponent('InView'))

describe('Container: StringEdField', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      active: false,
      disabled: false,
      edField: new ExtractedDataField(
        1,
        new FieldData(
          mockFieldValue,
          new FieldCoordinates(2, 0.19, 0.26, 0.8, 0.5),
          0.69,
        ),
      ),
      dtField: new DocumentTypeField(
        'verticalReference',
        'Vertical Reference',
        new DocumentTypeFieldMeta('BC', 'A'),
        FieldType.STRING,
        false,
        1,
        'mockDocumentTypeCode',
        1,
      ),
      validation: new FieldValidation(
        [{
          column: null,
          message: 'test error',
          index: undefined,
          row: null,
          kvId: null,
        }], [{
          column: null,
          message: 'test warning',
          index: undefined,
          row: null,
          kvId: null,
        }],
      ),
      id: 'mockId',
    }

    wrapper = shallow(<StringEdField {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct layout with multiple coordinates', () => {
    defaultProps.edField = new ExtractedDataField(
      1,
      new FieldData(
        '350',
        [
          new FieldCoordinates(2, 0.19, 0.26, 0.8, 0.5),
          new FieldCoordinates(2, 0.19, 0.26, 0.8, 0.5),
        ],
        0.69,
      ),
    )

    wrapper.setProps(defaultProps)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct layout with multiple tableCoordinates', () => {
    defaultProps.edField = new ExtractedDataField(
      1,
      new FieldData(
        '350',
        null,
        0.69,
        [
          new TableCoordinates(1, [[1, 1], [2, 3, 4]]),
          new TableCoordinates(1, [[1, 1], [2, 3, 4]]),
        ],
      ),
    )

    wrapper.setProps(defaultProps)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct layout if renderLabel is passed to props', () => {
    const Label = <div />

    defaultProps.renderLabel = jest.fn(() => Label)
    wrapper.setProps(defaultProps)

    expect(wrapper.contains(Label)).toEqual(true)
  })

  it('should not render validation result if field does not have validation errors and warnings', () => {
    defaultProps.validation = new FieldValidation([], [])
    wrapper.setProps(defaultProps)
    expect(wrapper.find(FieldValidationResult).exists()).toBe(false)
  })
})
