
import { mockComponent } from '@/mocks/mockComponent'
import { mockDayjs } from '@/mocks/mockDayjs'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { PrimitiveFieldContent } from '@/containers/DocumentField'
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
import { DateEdField } from './DateEdField'

jest.mock('dayjs', () => mockDayjs())

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/documents', () => ({
  updateExtractedData: jest.fn(),
}))

const FIELD_DATA_VALUE = '10/10/2023'

jest.mock('../useFieldProps', () => ({
  useFieldProps: jest.fn(() => ({
    onChangeData: jest.fn(),
    onFocus: jest.fn(),
    setHighlightedField: jest.fn(),
    highlightArea: jest.fn(),
    getValueToDisplay: jest.fn(() => FIELD_DATA_VALUE),
  })),
}))

jest.mock('@/containers/InView', () => mockComponent('InView'))

const mockedRenderActions = () => <div>Mocked renderActions</div>

describe('Container: DateEdField', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      active: false,
      disabled: false,
      edField: new ExtractedDataField(
        1,
        new FieldData(
          FIELD_DATA_VALUE,
          new FieldCoordinates(2, 0.19, 0.26, 0.8, 0.5),
          0.69,
        ),
      ),
      dtField: new DocumentTypeField(
        'verticalReference',
        'Vertical Reference',
        new DocumentTypeFieldMeta('BC', 'A'),
        FieldType.DATE,
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

    wrapper = shallow(<DateEdField {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct FieldActionsMenu', () => {
    const FieldActionsMenu = wrapper.find(PrimitiveFieldContent).children().at(3)
    expect(FieldActionsMenu).toMatchSnapshot()
  })

  it('should render correct FieldActionsMenu if renderActions was passed', () => {
    wrapper.setProps({
      ...defaultProps,
      renderActions: mockedRenderActions,
    })
    const FieldActionsMenu = wrapper.find(PrimitiveFieldContent).children().at(3)
    expect(FieldActionsMenu).toMatchSnapshot()
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
