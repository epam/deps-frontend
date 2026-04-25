
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { FieldType } from '@/enums/FieldType'
import { Select } from './FieldTypeSelect.styles'
import { FieldTypeSelect } from '.'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: FieldTypeSelect', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      disabled: false,
      value: FieldType.STRING,
      setValue: jest.fn(),
    }

    wrapper = shallow(<FieldTypeSelect {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call setValue when select value is changed', () => {
    wrapper.find(Select).props().onChange(FieldType.ENUM)

    expect(defaultProps.setValue).nthCalledWith(1, FieldType.ENUM)
  })
})
