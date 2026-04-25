
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { shallow } from 'enzyme'
import { PrototypeFields } from '@/containers/PrototypeFields'
import { PrototypeTables } from '@/containers/PrototypeTables'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import {
  PrototypeField,
  PrototypeFieldType,
  PrototypeFieldMapping,
} from '@/models/PrototypeField'
import {
  PrototypeTableField,
  PrototypeTableHeader,
  PrototypeTabularMapping,
  TableHeaderType,
} from '@/models/PrototypeTableField'
import { PrototypeData } from './PrototypeData'

const mockPrototypeId = 'prototypeId'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/hooks/useEventSource', () => ({
  useEventSource: jest.fn(),
  KnownBusinessEvent: {
    REFERENCE_LAYOUT_STATE_UPDATE: 'ReferenceLayoutStateUpdated',
  },
}))

const mockStringField = new PrototypeField({
  id: 'fieldId1',
  prototypeId: mockPrototypeId,
  name: 'Test Field',
  fieldType: new PrototypeFieldType({
    typeCode: FieldType.STRING,
    description: {},
  }),
  mapping: new PrototypeFieldMapping({
    keys: [
      'mappingKey1',
      'mappingKey2',
    ],
    mappingType: MappingType.ONE_TO_ONE,
    mappingDataType: FieldType.STRING,
  }),
  required: true,
})

const mockTableField = new PrototypeTableField({
  id: 'fieldId',
  prototypeId: mockPrototypeId,
  name: 'Test Table Field',
  fieldType: new PrototypeFieldType({
    typeCode: FieldType.TABLE,
    description: {},
  }),
  tabularMapping: new PrototypeTabularMapping({
    headerType: TableHeaderType.ROWS,
    headers: [
      new PrototypeTableHeader({
        name: 'Row name',
        aliases: ['Row alias'],
      }),
    ],
    occurrenceIndex: 1,
  }),
})

describe('Container: PrototypeData', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      regularFields: [mockStringField],
      tableFields: [mockTableField],
      fieldsViewType: PrototypeViewType.FIELDS,
      isEditMode: false,
      prototypeId: mockPrototypeId,
      addField: jest.fn(),
      removeField: jest.fn(),
      toggleEditMode: jest.fn(),
      updateField: jest.fn(),
    }

    wrapper = shallow(<PrototypeData {...defaultProps} />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render prototype fields if corresponding view type is passed', () => {
    const PrototypeFieldsComponent = wrapper.find(PrototypeFields)

    expect(PrototypeFieldsComponent.exists()).toBe(true)
    expect(PrototypeFieldsComponent.props().fields).toEqual([mockStringField])
  })

  it('should render prototype tables if corresponding view type is passed', () => {
    defaultProps.fieldsViewType = PrototypeViewType.TABLES

    wrapper.setProps(defaultProps)

    const PrototypeTablesComponent = wrapper.find(PrototypeTables)

    expect(PrototypeTablesComponent.exists()).toBe(true)
    expect(PrototypeTablesComponent.props().fields).toEqual([mockTableField])
  })
})
