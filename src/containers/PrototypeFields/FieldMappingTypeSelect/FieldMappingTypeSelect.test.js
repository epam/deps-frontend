
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import { Select } from './FieldMappingTypeSelect.styles'
import { FieldMappingTypeSelect } from '.'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: FieldMappingTypeSelect', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      disabled: false,
      value: MappingType.ONE_TO_ONE,
      setValue: jest.fn(),
    }

    wrapper = shallow(<FieldMappingTypeSelect {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call setValue when select value is changed', () => {
    wrapper.find(Select).props().onChange(FieldType.ENUM)

    expect(defaultProps.setValue).nthCalledWith(1, FieldType.ENUM)
  })
})
