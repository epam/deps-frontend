
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { EditableMappingKey } from './EditableMappingKey'
import { MappingKeys } from './MappingKeys'
import { IconButton, Tooltip } from './MappingKeys.styles'

const mockMappingKeys = ['1', '2', '3']

jest.mock('@/utils/env', () => mockEnv)

describe('Container: MappingKeys', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    jest.clearAllMocks()

    defaultProps = {
      keys: mockMappingKeys,
      updateMappingKeys: jest.fn(),
      isEditMode: null,
    }

    wrapper = shallow(<MappingKeys {...defaultProps} />)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Tooltip with mapping keys if keys length more than MAX_VISIBLE_MAPPING_KEYS', () => {
    defaultProps.keys = [...mockMappingKeys, '4', '5']

    wrapper.setProps(defaultProps)

    expect(wrapper.find(Tooltip).exists()).toBe(true)
  })

  it('should render button for adding mapping keys if edit mode is enabled', () => {
    defaultProps.isEditMode = true

    wrapper.setProps(defaultProps)

    expect(wrapper.find(IconButton).exists()).toBe(true)
  })

  it('should call updateMappingKeys when call updateMappingKey in EditableMappingKey', () => {
    const newKey = 'newKey'
    defaultProps.isEditMode = true

    wrapper.setProps(defaultProps)
    wrapper.find(EditableMappingKey).at(0).props().updateMappingKey(mockMappingKeys[0], newKey)

    expect(defaultProps.updateMappingKeys).nthCalledWith(1, [newKey, ...mockMappingKeys.slice(1)])
  })

  it('should call updateMappingKeys with correct argument when call removeMappingKey in EditableMappingKey', () => {
    defaultProps.isEditMode = true

    wrapper.setProps(defaultProps)
    wrapper.find(EditableMappingKey).at(0).props().removeMappingKey(0)

    expect(defaultProps.updateMappingKeys).nthCalledWith(1, mockMappingKeys.slice(1))
  })
})
