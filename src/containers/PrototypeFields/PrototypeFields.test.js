
import { mockEnv } from '@/mocks/mockEnv'
import { mockUuid } from '@/mocks/mockUuid'
import { shallow } from 'enzyme'
import React from 'react'
import { NoData } from '@/components/NoData'
import { EmptyPrototypeFields } from '@/containers/EmptyPrototypeFields'
import { FieldsSearchInput } from '@/containers/FieldsSearchInput'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import { Localization, localize } from '@/localization/i18n'
import {
  PrototypeField,
  PrototypeFieldType,
  PrototypeFieldMapping,
} from '@/models/PrototypeField'
import { EditableFieldCard } from './EditableFieldCard'
import { PrototypeFields } from './PrototypeFields'
import { Button } from './PrototypeFields.styles'
import { ReadOnlyFieldCard } from './ReadOnlyFieldCard'

const mockPrototypeId = 'prototypeId'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('uuid', () => mockUuid)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({
    id: mockPrototypeId,
  })),
}))

const mockFieldName1 = 'Test Field'
const mockFieldName2 = 'Field Name'
const mockMappingKey1 = 'mappingKey1'
const mockMappingKey2 = 'mappingKey2'
const mockMappingKey = 'Count Key'

const mockFields = [
  new PrototypeField({
    id: 'fieldId',
    prototypeId: 'prototypeId',
    name: mockFieldName1,
    fieldType: new PrototypeFieldType({
      typeCode: FieldType.STRING,
      description: {},
    }),
    mapping: new PrototypeFieldMapping({
      keys: [
        mockMappingKey1,
        mockMappingKey2,
      ],
      mappingDataType: FieldType.STRING,
      mappingType: MappingType.ONE_TO_ONE,
    }),
    required: true,
  }),
  new PrototypeField({
    id: 'fieldId2',
    prototypeId: 'prototypeId2',
    name: mockFieldName2,
    fieldType: new PrototypeFieldType({
      typeCode: FieldType.STRING,
      description: {},
    }),
    mapping: new PrototypeFieldMapping({
      keys: [mockMappingKey],
      mappingDataType: FieldType.STRING,
      mappingType: MappingType.ONE_TO_ONE,
    }),
    required: true,
  }),
]

const mockPrototypeField = new PrototypeField({
  id: '1',
  prototypeId: mockPrototypeId,
  name: localize(Localization.NEW_FIELD),
  fieldType: new PrototypeFieldType({
    typeCode: FieldType.STRING,
    description: {},
  }),
  mapping: new PrototypeFieldMapping({
    keys: [localize(Localization.NEW_KEY)],
    mappingDataType: FieldType.STRING,
    mappingType: MappingType.ONE_TO_ONE,
  }),
})

describe('Container: PrototypeFields', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      fields: mockFields,
      updatePrototypeField: jest.fn(),
      isEditMode: false,
      fieldsColumnsCount: 2,
      addField: jest.fn(),
      removeField: jest.fn(),
      toggleEditMode: jest.fn(),
    }

    wrapper = shallow(<PrototypeFields {...defaultProps} />)
  })

  it('should render the correct layout with default props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render EditableFieldCard in case isEditMode prop is true', () => {
    wrapper.setProps({
      ...defaultProps,
      isEditMode: true,
    })

    expect(wrapper.find(EditableFieldCard).at(0)).toMatchSnapshot()
  })

  it('should render empty fields list if fields are not provided', () => {
    defaultProps.fields = []

    wrapper = shallow(<PrototypeFields {...defaultProps} />)

    expect(wrapper.find(EmptyPrototypeFields).exists()).toBe(true)
  })

  it('should render "add new field" button if prototype is in edit mode and fields are provided', () => {
    defaultProps.isEditMode = true

    wrapper.setProps(defaultProps)

    expect(wrapper.find(Button).exists()).toBe(true)
  })

  it('should call addNew prop when click on "add new field" button', () => {
    defaultProps.isEditMode = true

    wrapper.setProps(defaultProps)
    wrapper.find(Button).props().onClick()

    expect(defaultProps.addField).nthCalledWith(1, mockPrototypeField)
  })

  it('should render Fields cards according to search value if there are fields names which contain this value', () => {
    wrapper.find(FieldsSearchInput).props().onChange(mockFieldName1)

    expect(wrapper.find(ReadOnlyFieldCard)).toHaveLength(1)
  })

  it('should render Fields cards according to search value if there are fields mapping keys which contain this value', () => {
    wrapper.find(FieldsSearchInput).props().onChange(mockMappingKey)

    expect(wrapper.find(ReadOnlyFieldCard)).toHaveLength(1)
  })

  it('should render NoData if no fields which contain search value', () => {
    const search = 'random'

    wrapper.find(FieldsSearchInput).props().onChange(search)

    expect(wrapper.find(NoData).exists()).toEqual(true)
  })
})
