
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { ManageFieldDisplayModeButton } from '@/containers/ManageFieldDisplayModeButton'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import {
  PrototypeField,
  PrototypeFieldType,
  PrototypeFieldMapping,
} from '@/models/PrototypeField'
import { ENV } from '@/utils/env'
import { ReadOnlyFieldCard } from './ReadOnlyFieldCard'

jest.mock('@/utils/env', () => mockEnv)

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

describe('Component: ReadOnlyFieldCard', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      field: mockField,
    }
  })

  it('should render the correct layout', () => {
    wrapper = shallow(<ReadOnlyFieldCard {...defaultProps} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should not render button for managing display mode only if feature flag is off', () => {
    ENV.FEATURE_FIELDS_DISPLAY_MODE = false

    wrapper = shallow(<ReadOnlyFieldCard {...defaultProps} />)

    expect(wrapper.find(ManageFieldDisplayModeButton).exists()).toBe(false)
  })

  it('should render button for managing display mode only if feature flag is on', () => {
    ENV.FEATURE_FIELDS_DISPLAY_MODE = true

    wrapper = shallow(<ReadOnlyFieldCard {...defaultProps} />)

    expect(wrapper.find(ManageFieldDisplayModeButton).exists()).toBe(true)
  })

  it('should not render button for managing display mode if feature flag is on and field type is not allowed for display mode', () => {
    ENV.FEATURE_FIELDS_DISPLAY_MODE = true

    defaultProps.field = {
      ...defaultProps.field,
      fieldType: new PrototypeFieldType({
        typeCode: FieldType.CHECKMARK,
        description: {},
      }),
    }

    wrapper = shallow(<ReadOnlyFieldCard {...defaultProps} />)

    expect(wrapper.find(ManageFieldDisplayModeButton).exists()).toBe(false)
  })
})
