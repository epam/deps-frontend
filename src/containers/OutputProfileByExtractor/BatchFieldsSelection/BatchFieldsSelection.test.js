
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { SelectorLabel } from './BatchFieldsSelection.styles'
import { BatchFieldsSelection } from '.'

jest.mock('@/utils/env', () => mockEnv)

const listCode = 'TestList'
const stringCode = 'TestString'
const enumCode = 'TestEnum'
const dateCode = 'TestDate'

const mockFields = [
  {
    field: new DocumentTypeField(
      listCode,
      'Test List Field',
      {
        baseType: FieldType.STRING,
      },
      FieldType.LIST,
      false,
      0,
      'TestListField',
      1,
    ),
    isInProfile: true,
  },
  {
    field: new DocumentTypeField(
      stringCode,
      'Test String Field',
      {},
      FieldType.STRING,
      false,
      0,
      'TestStringField',
      2,
    ),
    isInProfile: false,
  },
  {
    field: new DocumentTypeField(
      enumCode,
      'Test Enum Field',
      {},
      FieldType.ENUM,
      false,
      0,
      'TestEnumField',
      3,
    ),
    isInProfile: true,
  },
  {
    field: new DocumentTypeField(
      dateCode,
      'Test Date Field',
      {},
      FieldType.DATE,
      false,
      0,
      'TestDateField',
      4,
    ),
    isInProfile: false,
  },
]

describe('Component: BatchFieldsSelection', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      excludeFields: jest.fn(),
      includeFields: jest.fn(),
      isEditMode: true,
      fields: mockFields,
    }

    wrapper = shallow(<BatchFieldsSelection {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call excludeFields with proper argument while field batch deselection', () => {
    const label = wrapper.find({ id: FieldType.ENUM })
    const checkbox = label.props().children[2]
    checkbox.props.onChange(false)
    expect(defaultProps.excludeFields).nthCalledWith(1, [enumCode])
  })

  it('should call includeFields with proper argument while field batch selection', () => {
    const label = wrapper.find({ id: FieldType.DATE })
    const checkbox = label.props().children[2]
    checkbox.props.onChange(true)
    expect(defaultProps.includeFields).nthCalledWith(1, [dateCode])
  })

  it('should base selection on baseType for List fields type', () => {
    const label = wrapper.find({ id: FieldType.STRING })
    const checkbox = label.props().children[2]
    checkbox.props.onChange(true)
    expect(defaultProps.includeFields).nthCalledWith(1, [listCode, stringCode])
  })

  it('should not render SelectorLabels if it is not an edit mode', () => {
    defaultProps.isEditMode = false

    wrapper.setProps(defaultProps)

    expect(wrapper.find(SelectorLabel).length).toBe(0)
  })
})
