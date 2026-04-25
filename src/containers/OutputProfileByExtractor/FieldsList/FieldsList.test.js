
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { ProfileFieldCard } from '../ProfileFieldCard'
import { FieldsList } from './FieldsList'
import { DraggableItem } from './FieldsList.styles'

jest.mock('@/utils/env', () => mockEnv)

const mockField1 = new DocumentTypeField(
  'code1',
  'name',
  {},
  FieldType.ENUM,
  false,
  1,
  'code1',
  'pk',
)

const mockField2 = new DocumentTypeField(
  'code2',
  'name',
  {},
  FieldType.STRING,
  false,
  2,
  'code2',
  'pk',
)

const mockFields = [
  {
    field: mockField1,
    isInProfile: true,
  },
  {
    field: mockField2,
    isInProfile: false,
  },
]

describe('Component: FieldsList', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      fields: mockFields,
      isEditMode: false,
      onFieldToggle: jest.fn(),
      profileFields: ['code1', 'code2'],
      setProfileFields: jest.fn(),
    }

    wrapper = shallow(<FieldsList {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render DraggableItem if profile has only 1 field', () => {
    wrapper.setProps({
      ...defaultProps,
      profileFields: ['code1'],
    })

    expect(wrapper.find(DraggableItem).exists()).toBeFalsy()
  })

  it('should turn on dragging when enableDragging prop call on ProfileFieldCard', () => {
    wrapper.find(ProfileFieldCard).at(0).props().enableDragging()
    const { isDraggable } = wrapper.find(DraggableItem).at(0).props()

    expect(isDraggable).toEqual(true)
  })

  it('should turn off dragging when onDrop prop call on DraggableItem', () => {
    wrapper.find(ProfileFieldCard).at(0).props().enableDragging()
    wrapper.find(DraggableItem).at(0).props().onDrop()
    const { isDraggable } = wrapper.find(DraggableItem).at(0).props()

    expect(isDraggable).toEqual(false)
  })

  it('should update profile fields order in case of fields moving ', () => {
    const mockFields = [
      {
        field: mockField1,
        isInProfile: true,
      },
      {
        field: mockField2,
        isInProfile: true,
      },
    ]

    wrapper.setProps({
      ...defaultProps,
      fields: mockFields,
    })

    wrapper.find(DraggableItem).at(0).props().onMove(0, 1)

    expect(defaultProps.setProfileFields).nthCalledWith(1, ['code2', 'code1'])
  })
})
