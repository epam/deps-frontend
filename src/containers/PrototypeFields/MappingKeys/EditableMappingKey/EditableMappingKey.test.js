
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { EditableMappingKey } from './EditableMappingKey'
import { DeleteIconButton, MappingKeyInput } from './EditableMappingKey.styles'

jest.mock('@/utils/env', () => mockEnv)

const DEBOUNCE_TIME = 500

const mockEventObject = {
  target: {
    value: 'modified key',
  },
}

describe('Component: EditableMappingKey', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    jest.clearAllMocks()

    defaultProps = {
      isDeletingAllowed: true,
      mappingKeyIndex: 1,
      mappingKey: 'key',
      removeMappingKey: jest.fn(),
      updateMappingKey: jest.fn(),
    }

    wrapper = shallow(<EditableMappingKey {...defaultProps} />)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call updateMappingKey with correct arguments after input changing', async () => {
    wrapper.find(MappingKeyInput).at(0).props().onChange(mockEventObject)
    jest.advanceTimersByTime(DEBOUNCE_TIME)

    expect(defaultProps.updateMappingKey).nthCalledWith(
      1,
      defaultProps.mappingKey,
      mockEventObject.target.value,
    )
  })

  it('should call removeMappingKey with correct arguments on DeleteIcon click', async () => {
    wrapper.find(DeleteIconButton).at(0).props().onClick()

    expect(defaultProps.removeMappingKey).nthCalledWith(
      1,
      defaultProps.mappingKeyIndex,
    )
  })

  it('should not render DeleteIcon if deleting is not allowed', async () => {
    defaultProps.isDeletingAllowed = false

    wrapper.setProps(defaultProps)
    expect(wrapper.find(DeleteIconButton).exists()).toBe(false)
  })
})
