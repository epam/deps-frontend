
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { FieldValidationResult } from '@/containers/FieldAdapter/FieldValidationResult'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DictFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { FieldValidation, KvId } from '@/models/DocumentValidation'
import {
  DictFieldData,
  ExtractedDataField,
  FieldData,
} from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { TableCoordinates } from '@/models/TableCoordinates'
import { KeyValuePairEdField } from './KeyValuePairEdField'

const mockValue = 'label value verticalReference content'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('../useFieldProps', () => ({
  useFieldProps: jest.fn(() => ({
    onChangeData: jest.fn(),
    onFocus: jest.fn(),
    setHighlightedField: jest.fn(),
    highlightArea: jest.fn(),
    revertValue: jest.fn(),
    isRevertDisabled: false,
    getValueToDisplay: jest.fn(() => mockValue),
  })),
}))
jest.mock('../useCommandExtractionProps', () => ({
  useCommandExtractionProps: jest.fn(() => ({
    openExtractAreaModal: jest.fn(),
    isExtractionDisabled: false,
  })),
}))
jest.mock('@/containers/InView', () => mockComponent('InView'))

jest.mock('@/hooks/useExpandableText', () => ({
  useExpandableText: jest.fn(() => ({
    ExpandableContainer: ({ children }) => <div>{children}</div>,
    ToggleExpandIcon: () => 'mockIcon',
  })),
}))

describe('Container: KeyValuePairEdField', () => {
  let defaultProps, wrapper

  beforeEach(() => {
    defaultProps = {
      active: false,
      disabled: false,
      edField: new ExtractedDataField(
        10,
        new DictFieldData(
          new FieldData(
            'label key verticalReference content',
            new FieldCoordinates(1, 3, 3, 3, 3),
            0.6,
            [new TableCoordinates(1, [[1, 1]])],
          ),
          new FieldData(
            'label value verticalReference content',
            new FieldCoordinates(1, 4, 4, 4, 4),
            0.3,
            [new TableCoordinates(1, [[1, 1]])],
          ),
        ),
      ),
      dtField: new DocumentTypeField(
        'kv',
        'KV',
        new DictFieldMeta(),
        FieldType.DICTIONARY,
        false,
        0,
        'whole',
        726,
      ),
      validation: new FieldValidation(
        [{
          column: null,
          message: 'test error',
          index: undefined,
          row: null,
          kvId: KvId.KEY,
        }], [{
          column: null,
          message: 'test warning',
          index: undefined,
          row: null,
          kvId: KvId.VALUE,
        }],
      ),
      id: 'kv0',
    }

    wrapper = shallow(<KeyValuePairEdField {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct layout if field has multiple coordinates', () => {
    defaultProps.edField = new ExtractedDataField(
      10,
      new DictFieldData(
        new FieldData(
          'label key verticalReference content',
          [
            new FieldCoordinates(1, 3, 3, 3, 3),
            new FieldCoordinates(1, 3, 3, 3, 3),
          ],
          0.6,
          [new TableCoordinates(1, [[1, 1]])],
        ),
        new FieldData(
          'label value verticalReference content',
          new FieldCoordinates(1, 4, 4, 4, 4),
          0.3,
          [new TableCoordinates(1, [[1, 1]])],
        ),
      ),
    )

    wrapper.setProps(defaultProps)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct layout if field has multiple tableCoordinates', () => {
    defaultProps.edField = new ExtractedDataField(
      10,
      new DictFieldData(
        new FieldData(
          'label key verticalReference content',
          null,
          0.6,
          [new TableCoordinates(1, [[1, 1]])],
        ),
        new FieldData(
          'label value verticalReference content',
          null,
          0.3,
          [
            new TableCoordinates(1, [[1, 1], [2, 3, 4]]),
            new TableCoordinates(1, [[1, 1], [2, 3, 4]]),
          ],
        ),
      ),
    )

    wrapper.setProps(defaultProps)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct layout if key or value has validation errors and warnings', () => {
    defaultProps.validation = new FieldValidation(
      [{
        column: null,
        message: 'test error',
        index: undefined,
        row: null,
        kvId: 'key',
      }], [{
        column: null,
        message: 'test warning',
        index: undefined,
        row: null,
        kvId: 'value',
      }],
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
