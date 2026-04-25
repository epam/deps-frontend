
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { EnumFieldIcon } from '@/components/Icons/EnumField'
import { OpenedEyeIcon } from '@/components/Icons/OpenedEyeIcon'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DragNDropButton, IconButton } from './ProfileFieldCard.styles'
import { ProfileFieldCard } from '.'

jest.mock('@/utils/env', () => mockEnv)

const mockField = new DocumentTypeField(
  'code',
  'name',
  {},
  FieldType.ENUM,
  false,
  1,
  'code',
  'pk',
)

describe('Component: ProfileFieldCard', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      disabled: true,
      field: mockField,
      isInProfile: false,
      onFieldToggle: jest.fn(),
    }

    wrapper = shallow(<ProfileFieldCard {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render OpenedEyeIcon if field is in profile', () => {
    defaultProps.isInProfile = true

    wrapper.setProps(defaultProps)

    const Icon = wrapper.find(IconButton).props().icon
    const IconWrapper = shallow(<div>{Icon}</div>)

    expect(IconWrapper.find(OpenedEyeIcon).exists()).toBe(true)
  })

  it('should render correct icon for list field', () => {
    defaultProps.field = new DocumentTypeField(
      'code',
      'name',
      {
        baseType: FieldType.ENUM,
      },
      FieldType.LIST,
      false,
      1,
      'code',
      'pk',
    )

    wrapper.setProps(defaultProps)

    expect(wrapper.find(EnumFieldIcon).exists()).toBe(true)
  })

  it('should call onFieldToggle in case of eye icon click and if disabled prop is false', () => {
    defaultProps.disabled = false

    wrapper.setProps(defaultProps)
    wrapper.find(IconButton).props().onClick()

    expect(defaultProps.onFieldToggle).nthCalledWith(1, defaultProps.field.code)
  })

  it('should render DragNDropButton if editMode is enabled and enableDragging prop is passed', () => {
    wrapper.setProps({
      ...defaultProps,
      disabled: false,
      isInProfile: true,
      enableDragging: jest.fn(),
    })

    expect(wrapper.find(DragNDropButton)).toMatchSnapshot()
  })

  it('should call enableDragging in case of firing mouse down event on DragNDropButton', () => {
    const enableDraggingMock = jest.fn()
    wrapper.setProps({
      ...defaultProps,
      disabled: false,
      isInProfile: true,
      enableDragging: enableDraggingMock,
    })
    wrapper.find(DragNDropButton).props().onMouseDown()

    expect(enableDraggingMock).toHaveBeenCalled()
  })
})
