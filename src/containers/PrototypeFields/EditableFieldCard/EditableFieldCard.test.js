
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { mockUuid } from '@/mocks/mockUuid'
import { shallow } from 'enzyme'
import { clearKeyToAssign } from '@/actions/prototypePage'
import { ManageFieldDisplayModeButton } from '@/containers/ManageFieldDisplayModeButton'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import {
  PrototypeField,
  PrototypeFieldType,
  PrototypeFieldMapping,
  ListFieldDescription,
  EnumFieldDescription,
} from '@/models/PrototypeField'
import { keyToAssignSelector } from '@/selectors/prototypePage'
import { ENV } from '@/utils/env'
import { FieldMappingTypeSelect } from '../FieldMappingTypeSelect'
import { FieldTypeSelect } from '../FieldTypeSelect'
import { MappingKeys } from '../MappingKeys'
import { EditableFieldCard } from './EditableFieldCard'
import { NameInput, DeleteIconButton } from './EditableFieldCard.styles'

const mockAction = {
  clearKeyToAssign: 'clearKeyToAssign',
}
const mockDispatch = jest.fn((action) => action)

jest.mock('uuid', () => mockUuid)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))
jest.mock('@/selectors/prototypePage')
jest.mock('@/actions/prototypePage', () => ({
  clearKeyToAssign: jest.fn(() => mockAction.clearKeyToAssign),
}))

const mockField = new PrototypeField({
  id: 'fieldId',
  prototypeId: 'prototypeId',
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
    mappingDataType: FieldType.STRING,
    mappingType: MappingType.ONE_TO_ONE,
  }),
  required: true,
})

describe('Component: EditableFieldCard', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      field: mockField,
      removeField: jest.fn(),
      updatePrototypeField: jest.fn(),
      isSaved: true,
    }

    wrapper = shallow(<EditableFieldCard {...defaultProps} />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call updatePrototypeField with correct arg in case of field name change', () => {
    const mockUpdatedFieldName = 'updatedName'
    const mockEvent = {
      target: {
        value: mockUpdatedFieldName,
      },
    }
    wrapper.find(NameInput).props().onChange(mockEvent)

    expect(defaultProps.updatePrototypeField).nthCalledWith(1, {
      ...mockField,
      name: mockUpdatedFieldName,
    })
  })

  it('should call updatePrototypeField with correct arg in case of mapping key change', () => {
    const mockUpdatedKey = 'updatedMappingKey'
    wrapper.find(MappingKeys).props().updateMappingKeys([
      mockUpdatedKey,
      ...mockField.mapping.keys.slice(1),
    ])

    expect(defaultProps.updatePrototypeField).nthCalledWith(1, {
      ...mockField,
      mapping: {
        ...mockField.mapping,
        keys: [
          mockUpdatedKey,
          'mappingKey2',
        ],
      },
    })
  })

  it('should call updatePrototypeField with correct arg in case of mapping type change', () => {
    const field = {
      ...mockField,
      fieldType: {
        ...mockField.fieldType,
        typeCode: FieldType.ENUM,
      },
    }

    wrapper.setProps({
      ...defaultProps,
      field,
    })

    wrapper.find(FieldMappingTypeSelect).props().setValue(MappingType.ONE_TO_MANY)

    expect(defaultProps.updatePrototypeField).nthCalledWith(1, {
      ...mockField,
      fieldType: {
        ...field.fieldType,
        description: (
          new ListFieldDescription(
            field.fieldType.typeCode,
            new EnumFieldDescription(),
          )
        ),
      },
      mapping: {
        ...field.mapping,
        mappingType: MappingType.ONE_TO_MANY,
      },
    })
  })

  it('should call updatePrototypeField with correct arg in case of field type change', () => {
    wrapper.find(FieldTypeSelect).props().setValue(FieldType.ENUM)

    expect(defaultProps.updatePrototypeField).nthCalledWith(1, {
      ...mockField,
      fieldType: {
        ...mockField.fieldType,
        typeCode: FieldType.ENUM,
        description: {
          ...mockField.fieldType.description,
          ...new EnumFieldDescription(),
        },
      },
    })
  })

  it('should call removeField with correct arg in case of field deleting', () => {
    wrapper.find(DeleteIconButton).props().onClick()

    expect(defaultProps.removeField).nthCalledWith(1, mockField.id)
  })

  it('should call updatePrototypeField with correct arguments if click on Card', () => {
    const mockActiveKeyToAssign = keyToAssignSelector.getSelectorMockValue()

    wrapper.props().onClick()

    expect(defaultProps.updatePrototypeField).nthCalledWith(1, {
      ...mockField,
      mapping: {
        ...mockField.mapping,
        keys: [
          mockActiveKeyToAssign,
          ...mockField.mapping.keys,
        ],
      },
    })
  })

  it('should not call updatePrototypeField if no activeKeyToAssign case if click on Card', () => {
    keyToAssignSelector.mockReturnValue(null)
    wrapper = shallow(<EditableFieldCard {...defaultProps} />)

    wrapper.props().onClick()

    expect(defaultProps.updatePrototypeField).not.toBeCalled()
  })

  it('should call dispatch with clearKeyToAssign action in case of clicking on Card', () => {
    wrapper.props().onClick()

    expect(mockDispatch).nthCalledWith(1, clearKeyToAssign())
  })

  it('should not render button for managing display mode if feature flag is off', () => {
    ENV.FEATURE_FIELDS_DISPLAY_MODE = false

    wrapper = shallow(<EditableFieldCard {...defaultProps} />)

    expect(wrapper.find(ManageFieldDisplayModeButton).exists()).toBe(false)
  })

  it('should render button for managing display mode if feature flag is on and field type is allowed for display mode', () => {
    ENV.FEATURE_FIELDS_DISPLAY_MODE = true

    defaultProps.field = {
      ...defaultProps.field,
      fieldType: new PrototypeFieldType({
        typeCode: FieldType.STRING,
        description: {},
      }),
    }

    wrapper = shallow(<EditableFieldCard {...defaultProps} />)

    expect(wrapper.find(ManageFieldDisplayModeButton).exists()).toBe(true)
  })
})
